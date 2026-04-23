package com.growgenie.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.growgenie.dto.request.InvoiceRequest;
import com.growgenie.dto.response.InvoiceResponse;
import com.growgenie.entity.Invoice;
import com.growgenie.entity.User;
import com.growgenie.exception.ResourceNotFoundException;
import com.growgenie.repository.InvoiceRepository;
import com.growgenie.repository.UserRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.invoice.storage-path}")
    private String storagePath;

    public InvoiceResponse create(String email, InvoiceRequest request) throws IOException {
        User user = getUser(email);

        // Calculate totals
        double subtotal = request.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        double gst   = Math.round(subtotal * 0.18 * 100.0) / 100.0;
        double total = subtotal + gst;

        String itemsJson = objectMapper.writeValueAsString(request.getItems());

        Invoice invoice = Invoice.builder()
                .userId(user.getId())
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .itemsJson(itemsJson)
                .subtotal(subtotal)
                .gst(gst)
                .total(total)
                .status(Invoice.InvoiceStatus.UNPAID)
                .build();

        invoice = invoiceRepository.save(invoice);

        // Generate PDF
        String pdfPath = generatePdf(invoice, request.getItems(), user);
        invoice.setPdfPath(pdfPath);
        invoice = invoiceRepository.save(invoice);

        return toResponse(invoice);
    }

    public List<InvoiceResponse> getAllByUser(String email) {
        User user = getUser(email);
        return invoiceRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InvoiceResponse getById(String email, String id) {
        User user = getUser(email);
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
        return toResponse(invoice);
    }

    public InvoiceResponse updateStatus(String email, String id, Invoice.InvoiceStatus status) {
        User user = getUser(email);
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
        invoice.setStatus(status);
        return toResponse(invoiceRepository.save(invoice));
    }

    public String getPdfPath(String email, String id) {
        User user = getUser(email);
        Invoice invoice = invoiceRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
        return invoice.getPdfPath();
    }

    // ── PDF Generation ────────────────────────────────────────────────────────
    private String generatePdf(Invoice invoice, List<InvoiceRequest.InvoiceItem> items, User user) throws IOException {
        new File(storagePath).mkdirs();
        String fileName = storagePath + "INV-" + invoice.getId() + "-" + System.currentTimeMillis() + ".pdf";

        PdfWriter writer   = new PdfWriter(fileName);
        PdfDocument pdf    = new PdfDocument(writer);
        Document document  = new Document(pdf);

        DeviceRgb indigo   = new DeviceRgb(99, 102, 241);
        DeviceRgb darkBg   = new DeviceRgb(18, 18, 26);
        DeviceRgb lightGray= new DeviceRgb(240, 240, 248);

        // ── Header ──────────────────────────────────────────────────────────
        Paragraph header = new Paragraph("GrowGenie")
                .setFontSize(26).setBold()
                .setFontColor(indigo)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(header);

        document.add(new Paragraph("AI-Powered Business Builder — Tax Invoice")
                .setFontSize(11).setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER).setMarginBottom(20));

        // ── Invoice meta ─────────────────────────────────────────────────────
        Table meta = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
        meta.addCell(noBorder(new Cell().add(new Paragraph("Invoice #: INV-" + invoice.getId()).setBold())));
        meta.addCell(noBoard(new Cell().add(new Paragraph("Date: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")))
                .setTextAlignment(TextAlignment.RIGHT))));
        meta.addCell(noBoard(new Cell().add(new Paragraph("From: " + user.getName()).setFontColor(ColorConstants.DARK_GRAY))));
        meta.addCell(noBoard(new Cell().add(new Paragraph("To: " + invoice.getCustomerName())
                .setTextAlignment(TextAlignment.RIGHT).setFontColor(ColorConstants.DARK_GRAY))));
        document.add(meta);
        document.add(new Paragraph("\n"));

        // ── Items Table ───────────────────────────────────────────────────────
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 1, 1, 1})).useAllAvailableWidth();

        // Header row
        String[] headers = {"Item", "Qty", "Unit Price (₹)", "Total (₹)"};
        for (String h : headers) {
            Cell cell = new Cell().add(new Paragraph(h).setBold().setFontColor(ColorConstants.WHITE));
            cell.setBackgroundColor(indigo).setPadding(8);
            table.addCell(cell);
        }

        // Item rows
        for (InvoiceRequest.InvoiceItem item : items) {
            double lineTotal = item.getPrice() * item.getQuantity();
            table.addCell(paddedCell(item.getName()));
            table.addCell(paddedCell(String.valueOf(item.getQuantity())));
            table.addCell(paddedCell(String.format("%.2f", item.getPrice())));
            table.addCell(paddedCell(String.format("%.2f", lineTotal)));
        }
        document.add(table);
        document.add(new Paragraph("\n"));

        // ── Totals ────────────────────────────────────────────────────────────
        Table totals = new Table(UnitValue.createPercentArray(new float[]{3, 1})).useAllAvailableWidth();
        addTotalRow(totals, "Subtotal", String.format("₹ %.2f", invoice.getSubtotal()), false);
        addTotalRow(totals, "GST (18%)", String.format("₹ %.2f", invoice.getGst()), false);
        addTotalRow(totals, "Total Payable", String.format("₹ %.2f", invoice.getTotal()), true);
        document.add(totals);

        // ── Footer ────────────────────────────────────────────────────────────
        document.add(new Paragraph("\nThank you for your business!")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY).setMarginTop(20));

        document.close();
        return fileName;
    }

    private Cell noBoard(Cell cell) {
        return cell.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4);
    }

    private Cell noOrder(Cell cell) {
        return cell.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4);
    }

    private Cell noBoard2(Cell c) { return c.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4); }

    private Cell noBoard(Cell cell, boolean dummy) {
        return cell.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4);
    }

    private Cell noOrder2(Cell c) { return c.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4); }

    // Utility: no-border cell
    private Cell noBoard(Cell c, int i) {
        return c.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4);
    }

    private Cell noBorder(Cell c) {
        return c.setBorder(com.itextpdf.layout.borders.Border.NO_BORDER).setPadding(4);
    }

    // ✅ After (correct)
    private Cell paddedCell(String text) {
        return new Cell().add(new Paragraph(text)).setPadding(7)
                .setBorder(new com.itextpdf.layout.borders.SolidBorder(
                        com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY, 0.5f));
    }


    private void addTotalRow(Table t, String label, String value, boolean bold) {
        Paragraph lp = new Paragraph(label);
        Paragraph vp = new Paragraph(value).setTextAlignment(TextAlignment.RIGHT);
        if (bold) { lp.setBold(); vp.setBold(); }
        t.addCell(noBorder(new Cell().add(lp)));
        t.addCell(noBorder(new Cell().add(vp)));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private InvoiceResponse toResponse(Invoice i) {
        return InvoiceResponse.builder()
                .id(i.getId()).customerName(i.getCustomerName())
                .customerEmail(i.getCustomerEmail()).itemsJson(i.getItemsJson())
                .subtotal(i.getSubtotal()).gst(i.getGst()).total(i.getTotal())
                .status(i.getStatus()).pdfPath(i.getPdfPath())
                .createdAt(i.getCreatedAt()).build();
    }
}
