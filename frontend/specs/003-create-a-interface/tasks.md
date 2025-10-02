# Tasks: Code Editor Interface

**Input**: Design documents from `/specs/003-create-a-interface/`
**Prerequisites**: plan.md, data-model.md, quickstart.md

## Phase 3.1: Setup
- [x] T001: [P] Create the `CodeEditor` component file at `src/components/CodeEditor.tsx`.
- [x] T002: [P] Install `react-simple-code-editor` and `prismjs` dependencies by running `pnpm install react-simple-code-editor prismjs`.

## Phase 3.2: Core Implementation
- [x] T003: Implement the basic UI of the `CodeEditor` component in `src/components/CodeEditor.tsx` using `shadcn/ui` components for the text area and the button.
- [x] T004: Implement syntax highlighting and line numbers in `src/components/CodeEditor.tsx` using `react-simple-code-editor` and `prismjs`.
- [x] T005: Implement the "Send to API" button functionality in `src/components/CodeEditor.tsx`. The button should be disabled when the editor is empty. When clicked, it should send the code to the API and display the response.

## Phase 3.3: Integration
- [x] T006: Integrate the `CodeEditor` component into the `App.tsx` file. Import and render the `CodeEditor` component.

## Dependencies
- T001 blocks T003, T004, T005
- T002 blocks T004
- T003, T004, T005 block T006

## Parallel Example
```
# Launch T001 and T002 together:
Task: "[P] Create the `CodeEditor` component file at `src/components/CodeEditor.tsx`."
Task: "[P] Install `react-simple-code-editor` and `prismjs` dependencies by running `pnpm install react-simple-code-editor prismjs`."
```