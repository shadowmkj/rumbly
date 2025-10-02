# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Vite project with dependencies (React, TypeScript, Tailwind CSS, shadcn/ui)
- [ ] T003 [P] Configure linting (ESLint) and formatting (Prettier) tools



## Phase 3.2: Core Implementation
- [ ] T007 [P] Create AssemblyInput component in src/components/AssemblyInput.tsx
- [ ] T008 [P] Create AssemblyOutput component in src/components/AssemblyOutput.tsx
- [ ] T009 [P] Implement state management for assembly code and output in src/App.tsx
- [ ] T010 Implement the logic to run assembly code (e.g., using a web worker or a library)
- [ ] T011 Input validation for assembly code
- [ ] T012 Error handling and display

## Phase 3.4: Integration
- [ ] T013 Integrate with a backend service if necessary for running code
- [ ] T014 Add analytics or logging services

## Phase 3.4: Polish
- [ ] T015 [P] (Optional) Write unit tests for utility functions in tests/unit/utils.test.ts
- [ ] T016 [P] (Optional) Write component tests for new components.
- [ ] T017 Performance optimization for code execution
- [ ] T018 [P] Update README.md with usage instructions
- [ ] T019 Code cleanup and refactoring
- [ ] T020 Run manual-testing.md

## Dependencies
- T007 blocks T008
- Implementation before polish (T015-T020)

## Parallel Example
```
# Launch T001-T003 together:
Task: "Create project structure per implementation plan"
Task: "Initialize Vite project with dependencies (React, TypeScript, Tailwind CSS, shadcn/ui)"
Task: "[P] Configure linting (ESLint) and formatting (Prettier) tools"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
2. **From User Stories**:
   - Quickstart scenarios → validation tasks

3. **Ordering**:
   - Setup → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All entities have model tasks
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task