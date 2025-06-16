
# Desenvolvimento da Aplicação

## Wireframes
Tela Inicial

![Tela Inicial](https://github.com/user-attachments/assets/271adbe2-c422-4197-aa2c-b49a564552bd)

Visualização de Lista por Codigo

![Lista sem logar](https://github.com/user-attachments/assets/8141a878-0b14-42bc-81d0-015fb325032c)

Edição e criação de listas

![Ja logado](https://github.com/user-attachments/assets/8def3eb6-56ec-46ea-b14e-20ec1ae5b537)


## Modelagem da Aplicação
[Descreva a modelagem da aplicação, incluindo a estrutura de dados, diagramas de classes ou entidades, e outras representações visuais relevantes.]

Diagrama DER
![arq](https://github.com/ICEI-PUC-Minas-PCO-SI/pco-si-2025-1-dad-g2-aplicacaodistribuida/blob/9a904e46e0c32c3214af545a24ab0b3f4fdf92ba/docs/img/diagrama_der.png)

Diagrama de Classes
![arq](https://github.com/ICEI-PUC-Minas-PCO-SI/pco-si-2025-1-dad-g2-aplicacaodistribuida/blob/master/docs/img/diagrama_de_classes.png)

Diagrama de Casos de Uso
![arq](https://github.com/ICEI-PUC-Minas-PCO-SI/pco-si-2025-1-dad-g2-aplicacaodistribuida/blob/master/docs/img/DiagramaCasodeUso.PNG)

## Tecnologias Utilizadas

Tecnologias Utilizadas: 

- HTML, CSS, JS e REACT hospedado no Vercel para Front-End;
- C# para Back-End hospedado no Render para Back-end;
- Banco de Dados PostgreSQL hospedado no SupaBase;

## Programação de Funcionalidades

### Requisitos Atendidos

### Requisitos Funcionais

|ID    | Descrição do Requisito | Responsável | Artefato Criado |
|------|------------------------|------------|-----------------|
|RF-001| A aplicação deve permitir que um usuário visualize uma lista de compras mesmo sem autenticar | Pedro Morais | ListaDetalhada.jsx |
|RF-002| A aplicação deve permitir o cadastro e login pelo próprio usuário, por meio de um email | Igor | Header.jsx |
|RF-003| A aplicação deve permitir que um usuário visualize uma lista de compras mesmo sem autenticar | Pedro Morais | ListaDetalhada.jsx |
|RF-004| A aplicação deve permitir que o usuário marque se o item foi comprado, mesmo que não esteja autenticado | Pedro Morais | ListaDetalhada.jsx |
|RF-007| A aplicação deve permitir copiar a URL da lista em exibição | Gustavo Rafá| ListsPage.jsx |

### Requisitos Não Atendidos:

- Utilização de WebSocket para Sincronismo, no projeto essa tecnologia não funcionou corretamente, então o grupo decidiu por retirá-lo.
- RF-005
- RF-006

# API RESTful - Backend

API RESTful desenvolvida em **ASP.NET Core** para gerenciamento de listas de compras, produtos e usuários. Permite que usuários autenticados criem, atualizem, excluam e consultem listas de compras e produtos associados, além de gerenciar suas próprias contas.

---

## Sumário

- [Estrutura dos Controllers](#estrutura-dos-controllers)
  - [ProdutosController](#produtoscontroller)
  - [ListaComprasController](#listacomprascontroller)
  - [UsuariosController](#usuarioscontroller)
- [Autenticação](#autenticação)
- [Tratamento de Erros](#tratamento-de-erros)
- [DTOs Utilizados](#dtos-utilizados)
- [Observações Técnicas](#observações-técnicas)
- [Fluxo Básico de Uso](#fluxo-básico-de-uso)
- [Considerações Finais](#considerações-finais)

---

## Estrutura dos Controllers

### ProdutosController

Responsável pelo CRUD de produtos dentro de uma lista de compras.

#### Endpoints

- **POST /criar**  
  Cria um novo produto em uma lista de compras existente.  
  - **Request:** `CriarProdutoRequestDTO`  
  - **Response:** `CriarProdutoResponseDTO` com o código da lista e o ID do produto criado.  
  - **Erros:** Lista não encontrada, erro ao criar produto.

- **PUT /atualizar**  
  Atualiza os dados de um produto existente.  
  - **Request:** `AtualizarProdutoRequestDTO`  
  - **Response:** `200 OK` em caso de sucesso.  
  - **Erros:** Lista ou produto não encontrado, erro ao atualizar.

- **DELETE /deletar**  
  Remove um produto de uma lista de compras.  
  - **Request:** `DeletarProdutoRequestDTO`  
  - **Response:** `200 OK` em caso de sucesso.  
  - **Erros:** Lista ou produto não encontrado, erro ao deletar.

> **Observação:**  
> Os métodos buscam a lista pelo código e o produto pelo ID.  
> Há comentários para futura implementação de validação do usuário autenticado.

---

### ListaComprasController

Gerencia as listas de compras dos usuários.

#### Endpoints

- **PUT /atualizar**  
  Atualiza nome e descrição de uma lista de compras.  
  - **Request:** `AtualizarListaComprasRequestDTO`  
  - **Response:** `200 OK` ou mensagem de que nada foi alterado.  
  - **Erros:** Lista não encontrada, não pertence ao usuário, erro ao atualizar.

- **DELETE /deletar**  
  Exclui uma lista de compras.  
  - **Request:** `DeletarListaComprasRequestDTO`  
  - **Response:** `200 OK` em caso de sucesso.  
  - **Erros:** Lista não encontrada, não pertence ao usuário, erro ao deletar.

> **Observação:**  
> Sempre valida se a lista pertence ao usuário autenticado antes de permitir alterações ou exclusão.

---

### UsuariosController

Gerencia operações relacionadas ao usuário autenticado.

#### Endpoints

- **DELETE /deletar**  
  Exclui o usuário autenticado.  
  - **Request:** Nenhum parâmetro.  
  - **Response:** `200 OK` em caso de sucesso.  
  - **Erros:** Usuário não encontrado, erro ao deletar.

---

## Autenticação

- Todos os endpoints são protegidos por `[Authorize]`.
- O ID do usuário é extraído do token JWT via `_tokenService.GetUserIdFromToken(User)`.
- Algumas validações de usuário estão comentadas nos métodos de produtos, mas implementadas nos métodos de listas e usuários.

---

## Tratamento de Erros

- Retorna mensagens específicas para:
  - Erros de autenticação
  - Autorização
  - Não encontrado
  - Falhas de banco de dados
- Utiliza **DTOs de resposta** para padronizar mensagens.

---

## DTOs Utilizados

- `CriarProdutoRequestDTO`, `CriarProdutoResponseDTO`
- `AtualizarProdutoRequestDTO`
- `DeletarProdutoRequestDTO`
- `AtualizarListaComprasRequestDTO`
- `DeletarListaComprasRequestDTO`
- `MessageResponseDTO`

---

## Observações Técnicas

- Utiliza **Entity Framework Core** para acesso ao banco de dados.
- Entidades principais: `Usuarios`, `ListaCompras`, `Produto`.
- Relacionamento entre listas e produtos via navegação e foreign key.
- Código preparado para futuras melhorias de segurança e validação.

---

## Fluxo Básico de Uso

1. Usuário se autentica e obtém um token JWT.
2. Cria uma lista de compras.
3. Adiciona, atualiza ou remove produtos da lista.
4. Pode atualizar ou excluir a lista.
5. Pode excluir sua própria conta.

---

## Considerações Finais

API adequada para aplicações de controle de listas de compras, com foco em segurança, organização e facilidade de uso para o usuário final.  
O código está estruturado para facilitar manutenção e expansão futura.

## 🚀 Desenvolvimento do Front‑end

O front‑end da aplicação foi construído em **React**, consumindo nossa API RESTful em ASP.NET Core. Abaixo um breve passo a passo do processo:

1. **Wireframes e Protótipos**  
   - Iniciamos pelo desenho das telas em Figma, documentando as três principais views:  
     - **Tela Inicial**: acesso à home e busca por código de lista  
     - **Lista sem Login**: visualização de itens, sem ações de CRUD  
     - **Lista com Login**: adição, edição e marcação de itens  
   - As imagens dos wireframes foram incluídas na pasta `/docs/img/`.

2. **Estrutura de Pastas e Componentes**  
   - `src/`  
     - `components/`  
       - `HomePage/` — paginação inicial e formulário de login  
       - `Header/` e `Footer/` — layout fixo em todas as telas  
       - `ListaDetalhada/` — componente principal com polling a cada 3 s  
       - `ListsPage/` — listagem de todas as listas do usuário  
       - `Search/`, `BuyList/`, `Form/`, `LoadingModal/`, etc.  
     - `services/api.ts` — instância do Axios configurada com baseURL e interceptors de autenticação  
     - `App.tsx` — definição das rotas e leitura de token em LocalStorage  

3. **Consumo de API e Polling**  
   - Utilizamos `useEffect` com `setInterval` para atualizar a lista a cada 3 segundos, detectando alterações e exibindo notificações via SweetAlert2.  
   - Todo acesso autenticado passa o JWT no header `Authorization: Bearer <token>`.

4. **Gerenciamento de Estado**  
   - Hooks React (`useState`, `useRef`) para armazenar itens, loading, mensagens de autenticação e controle de formulários.  
   - Comparamos o estado anterior (`prevRawDataRef`) com os novos dados para disparar alertas de remoção ou mudança de status.

5. **Deploy Contínuo**  
   - Hospedagem do front‑end no **Vercel**, com preview automático a cada push na branch `main`.  
   - Integração básica com ESLint e Prettier, garantindo consistência de código.
