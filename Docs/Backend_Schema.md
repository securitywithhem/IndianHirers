# Indian Hires – Backend Schema (Future‑Ready)

**Version:** 1.0  
**Date:** 18 July 2026  
*Note: MVP has no backend. This schema is a blueprint for future Supabase/PostgreSQL integration.*

### Tables

#### inquiries
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique identifier |
| created_at | timestamptz | Auto‑timestamp |
| name | text (required) | |
| phone | text (required) | |
| event_date | text (optional) | |
| message | text (optional) | |
| source | text (optional) | e.g., 'contact_form' |
| is_read | boolean | default false |
| email | text (optional) | |

#### products (future CMS)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| name | text | Product/set name |
| category | text | crockery, cutlery, etc. |
| description | text | |
| image_url | text | |
| is_active | boolean | soft delete |
| created_at | timestamptz | |

#### testimonials
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | |
| client_name | text | |
| client_designation | text | |
| quote | text | |
| featured | boolean | show on homepage |
| created_at | timestamptz | |

### Indexes & API
- Indexes: `inquiries.created_at`, `products.category`, `testimonials.featured`
- Future endpoints: `POST /api/inquiries`, `GET /api/products`, `GET /api/testimonials`
- Auth: Supabase Auth / NextAuth.
