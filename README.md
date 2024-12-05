# GDPR Q&A Management Platform - Technical Challenge

## Overview

This project demonstrates my approach to building a full-stack application for managing GDPR compliance questions, focusing on code quality, architecture decisions, and problem-solving strategies.

## Requirements Implementation

### Core Features Completed
✅ Question Management (CRUD operations)
✅ Question Assignment
✅ Bulk Assignment
✅ Custom Properties/Tags
✅ Search
✅ Filtering (by assignee and properties)

### Technical Implementation

#### Frontend Architecture
- **React + TypeScript**: Ensures type safety and better developer experience
- **State Management**:
  - Zustand for global state (selected questions, filters)
  - React Query for server state and caching
- **UI/UX**:
  - Tailwind CSS for rapid styling
  - Responsive design with mobile considerations
  - Accessible components

#### Backend Design
- **Express + TypeScript**: Strong typing and modern JavaScript features
- **Search Implementation**: TF-IDF approach using natural.js
- **Data Persistence**: Airtable integration for quick prototype deployment

## Key Technical Decisions

### Why TF-IDF for Search?
I chose TF-IDF over other search methods (like embeddings or Elasticsearch) because:

1. **Development Speed**: Implemented and deployed quickly while maintaining good search quality
2. **Resource Efficiency**: In-memory processing without additional infrastructure
3. **Complexity Balance**: Provides search capabilities without overengineering
4. **Future-Proof**: Can be easily upgraded to vector search if needed

### Architecture Patterns

1. **Domain-Driven Design Influence**
   - Clear separation between core business logic and infrastructure
   - Domain types shared across frontend and backend
   - Pure functions for business rules

2. **Clean Architecture Principles**
   - Core business logic independent of frameworks
   - Easy to test and modify components
   - Clear dependency flow

## Project Structure Highlights

```
privasee-tech-test/
├── backend/
│   ├── src/
│   │   ├── core/          # Pure business logic
│   │   ├── api/           # Express routes
│   │   └── repositories/  # Data access layer
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API integration
│   │   └── store/         # State management
└── types/                 # Shared TypeScript types
```

## Running the Project

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
# Backend (.env)
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name

# Frontend (.env.development)
VITE_API_URL=http://localhost:3000/api
```

3. Start development servers:
```bash
pnpm dev
```

## Design Considerations & Tradeoffs

### Search Implementation
- Chose TF-IDF for quick implementation while maintaining search quality
- Considered but declined Elasticsearch (overengineering for prototype)
- Vector search could be added later for semantic understanding

### State Management
- Zustand over Redux for simplicity and reduced boilerplate
- React Query for automatic cache invalidation and loading states
- Local state for form handling and UI interactions

### Data Storage
- Airtable provides quick setup and flexible schema
- Tradeoff: Limited query capabilities compared to traditional databases
- Benefit: No infrastructure management needed

## Areas for Enhancement

Given more time, I would:

1. **Testing Infrastructure**
   - Add unit tests for backend business logic
   - Implement integration tests for API endpoints
   - Add E2E tests using Cypress or Playwright
   - Set up test coverage reporting

2. **Type Safety Improvements**
   - Implement end-to-end type safety using tRPC or GraphQL
   - Add runtime type checking for API responses
   - Generate API client types from OpenAPI spec
   - Stricter TypeScript configuration

3. **Search Improvements**
   - Implement semantic search using embeddings
   - Add relevance scoring
   - Support advanced query operators

4. **Architecture**
   - Add proper error boundaries
   - Add input sanitisation and validation
   - Implement comprehensive logging
   - Add request/response interceptors

5. **Performance**
   - Add request caching
   - Implement pagination
   - Optimise bundle size
   - Add performance monitoring

I prioritised implementing core functionality and maintaining clean architecture over testing in the interest of time. However, in a production environment, I would ensure comprehensive test coverage and end-to-end type safety before deployment.

## Learning Outcomes

This challenge helped me demonstrate:

1. **Problem-Solving Approach**
   - Breaking down requirements into manageable tasks
   - Making pragmatic technical decisions
   - Balancing feature completeness with code quality

2. **Full-Stack Development Skills**
   - Modern React patterns and hooks
   - Clean API design
   - Type-safe development

3. **Architecture Design**
   - Scalable application structure
   - Clear separation of concerns
   - Maintainable codebase
