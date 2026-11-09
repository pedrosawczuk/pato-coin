# Execution Rules

- **Strict Scope:** Only read, analyze, and edit the exact files explicitly mentioned in the user request.
- **No Background Checks:** Do NOT run test suites (`npm test`, `pytest`, etc.), linters (`eslint`, `flake8`, etc.), or typecheckers unless explicitly instructed by the user.
- **Fast Execution:** Make the minimal required change, present the diff/code directly, and do not perform repository-wide indexing or verification loops.
- **Pragmatic Delivery:** Do not require overly pedantic or exhaustive validation; write straightforward code focused on ensuring it simply works.

# Communication & Language

- **Language & Tone:** Responder sempre em Português, de forma concisa, direta e sem introduções ou explicações desnecessárias.

# Code Style & Dependencies

- **Zero Collateral Refactoring:** Nunca refatorar código adjacente que não esteja diretamente relacionado à tarefa.
- **No New Dependencies:** Não adicionar bibliotecas ou pacotes npm/pip a menos que seja estritamente necessário ou solicitado.
- **Preserve Comments:** Manter comentários e documentações existentes sem removê-los durante as alterações.
- **No Inline Comments:** Nunca adicionar novos comentários no código (ex.: `//`), a menos que explicitamente solicitado.

# Git & Delivery

- **Commit Conventions:** Padrão de commits (ex.: Conventional Commits como `feat:`, `fix:`) e não criar branches/commits sem aviso prévio.
