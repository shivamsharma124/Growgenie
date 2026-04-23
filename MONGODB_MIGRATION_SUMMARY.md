# MongoDB Migration Summary

## Overview
Successfully migrated GrowGenie backend from **MySQL** to **MongoDB** database.

## Changes Made

### 1. **pom.xml** - Dependency Updates
- ✅ **Removed**: `spring-boot-starter-data-jpa`
- ✅ **Removed**: `mysql-connector-j`
- ✅ **Added**: `spring-boot-starter-data-mongodb`

### 2. **application.properties** - Database Configuration
- ✅ **Removed**:
  - `spring.datasource.url`
  - `spring.datasource.username`
  - `spring.datasource.password`
  - `spring.datasource.driver-class-name`
  - `spring.jpa.hibernate.ddl-auto`
  - `spring.jpa.show-sql`
  - `spring.jpa.properties.hibernate.*`

- ✅ **Added**:
  - `spring.data.mongodb.uri=${MONGO_URI}` (using MONGO_URI from .env file)

### 3. **Entity Classes** - JPA to MongoDB Annotations

#### User.java
- Changed: `@Entity` → `@Document(collection = "users")`
- Changed: `@Id @GeneratedValue(strategy = IDENTITY)` → `@Id`
- Changed: `Long id` → `String id` (MongoDB ObjectId)
- Removed: `@Column`, `@Table` annotations
- Changed: `@PrePersist` → `@org.springframework.data.mongodb.core.mapping.event.PreSave`
- Added null check in onCreate() method

#### Product.java
- Changed: `@Entity` → `@Document(collection = "products")`
- Changed: `Long id` → `String id`
- **Removed**: `@ManyToOne User user` relationship
- **Added**: `String userId` field (denormalized reference)
- Removed: JPA annotations (`@Column`, `@Table`, `@JoinColumn`)

#### Invoice.java
- Changed: `@Entity` → `@Document(collection = "invoices")`
- Changed: `Long id` → `String id`
- **Removed**: `@ManyToOne User user` relationship
- **Added**: `String userId` field
- Removed: `@Enumerated(EnumType.STRING)` (MongoDB handles this natively)

#### Faq.java
- Changed: `@Entity` → `@Document(collection = "faqs")`
- Changed: `Long id` → `String id`
- **Removed**: `@ManyToOne User user` relationship
- **Added**: `String userId` field

#### AiGeneration.java
- Changed: `@Entity` → `@Document(collection = "ai_generations")`
- Changed: `Long id` → `String id`
- **Removed**: `@ManyToOne User user` relationship
- **Added**: `String userId` field

### 4. **Repository Interfaces** - MongoRepository Migration

All repositories changed from:
```java
extends JpaRepository<Entity, Long>
```
To:
```java
extends MongoRepository<Entity, String>
```

**Updated Repositories:**
- UserRepository
- ProductRepository
- InvoiceRepository
- FaqRepository
- AiGenerationRepository

All custom query methods updated to use `String` IDs instead of `Long`:
- `findByUserId(String userId)`
- `findByIdAndUserId(String id, String userId)`
- `deleteByIdAndUserId(String id, String userId)`

### 5. **Service Classes** - ID Type & Entity Updates

#### ProductService
- Changed all methods from `Long id` → `String id`
- Changed: `product.setUser(user)` → `product.setUserId(user.getId())`

#### FaqService
- Changed: `faq.setUser(user)` → `faq.setUserId(user.getId())`
- Changed delete method: `Long id` → `String id`

#### InvoiceService
- Changed: `invoice.setUser(user)` → `invoice.setUserId(user.getId())`
- Changed all ID parameters from `Long id` → `String id`

#### AiPlannerService
- Changed: `gen.setUser(user)` → `gen.setUserId(user.getId())`

#### AdminService
- Changed: `deleteUser(Long id)` → `deleteUser(String id)`
- Changed: `promoteToAdmin(Long id)` → `promoteToAdmin(String id)`

### 6. **Controller Classes** - Path Variable Updates

All controllers updated `@PathVariable Long id` → `@PathVariable String id`:

#### ProductController
- `getById(@PathVariable String id)`
- `update(@PathVariable String id, ...)`
- `delete(@PathVariable String id)`

#### InvoiceController
- `getById(@PathVariable String id)`
- `updateStatus(@PathVariable String id, ...)`

#### FaqController
- `delete(@PathVariable String id)`

#### AdminController
- `deleteUser(@PathVariable String id)`
- `promoteToAdmin(@PathVariable String id)`

### 7. **DTOs (Response) - ID Type Updates**

Changed ID field from `Long id` to `String id`:
- ProductResponse.java
- InvoiceResponse.java
- FaqResponse.java
- AiResponse.java

## Database Connection Details

### .env File (Already Contains)
```
MONGO_URI=mongodb+srv://shivamsharmasr3623_db_user:4Pq8dSJvsgkRdWwT@growgenie.1odxgfb.mongodb.net/growgenie_db
GROQ_API_KEY=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
```

The MongoDB connection is now using the MONGO_URI from your .env file.

## Key Differences - MySQL vs MongoDB

| Aspect | MySQL (Old) | MongoDB (New) |
|--------|------------|--------------|
| **IDs** | Auto-increment Long | String (ObjectId) |
| **Relationships** | Foreign keys (@ManyToOne) | Denormalized fields (userId) |
| **Driver** | `mysql-connector-j` | `spring-boot-starter-data-mongodb` |
| **ORM** | JPA/Hibernate | MongoDB Spring Data |
| **Annotations** | @Entity, @Table, @Column | @Document, @Id, @Field |
| **DDL** | `spring.jpa.hibernate.ddl-auto` | Auto-collection creation |

## Collections Created in MongoDB

The following collections will be created automatically:
- `users`
- `products`
- `invoices`
- `faqs`
- `ai_generations`

## Next Steps

1. ✅ Dependencies updated
2. ✅ Entities migrated to MongoDB format
3. ✅ Repositories updated to MongoRepository
4. ✅ Services updated with new entity structure
5. ✅ Controllers updated with String IDs
6. ✅ DTOs updated with String IDs
7. **TODO**: Run `mvn clean install` to build and compile
8. **TODO**: Start the application and test all endpoints
9. **TODO**: Verify MongoDB connection and data persistence

## Notes

- **MySQL is completely removed** from the backend configuration
- All MongoDB collections use `userId` field instead of embedding User objects (for better scalability)
- The database will auto-create collections when documents are first inserted
- Ensure your MongoDB server is running and accessible via the MONGO_URI before starting the application

## Rollback Information

If you need to rollback to MySQL, you would need to:
1. Restore original pom.xml with JPA and MySQL dependencies
2. Restore original entity classes with @Entity, @Table, etc.
3. Restore repositories extending JpaRepository
4. Restore original application.properties with MySQL configuration
5. Revert services and controllers to use Long IDs and User relationships

---

**Status**: Migration Complete ✅
**Date**: 2026-04-23
**Database**: MongoDB Cloud Atlas
