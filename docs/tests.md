[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.

1. Casos de Teste – Requisitos Funcionais
🔹 1.1 Autenticação
ID	Caso de Teste	Entrada	Resultado Esperado
RF01	Registrar novo usuário	Nome, e-mail e senha válidos	Status 200, usuário registrado
RF02	Registrar com e-mail já usado	Mesmo e-mail de usuário existente	Status 400, erro de duplicidade
RF03	Login com credenciais válidas	E-mail e senha corretos	Status 200, token JWT retornado
RF04	Login com senha inválida	E-mail correto, senha errada	Status 401, mensagem de erro
RF05	Login com usuário inexistente	E-mail não cadastrado	Status 404, mensagem de erro

🔹 1.2 Gerenciamento de Lista de Compras
ID	Caso de Teste	Entrada	Resultado Esperado
RF06	Criar nova lista de compras	Nome da lista + token válido	Status 200, código da lista retornado
RF07	Listar todas as listas do usuário	Token válido	Status 200, array de listas retornado
RF08	Deletar uma lista existente	Código da lista + token válido	Status 200, confirmação de remoção
RF09	Deletar uma lista inexistente	Código inválido + token	Status 404, mensagem de erro
RF10	Criar lista sem autenticação	Nome da lista, sem token	Status 401, acesso negado

🔹 1.3 Gerenciamento de Produtos
ID	Caso de Teste	Entrada	Resultado Esperado
RF11	Adicionar produto a uma lista	Nome, quantidade, código da lista	Status 200, código do produto retornado
RF12	Listar produtos de uma lista	Código da lista	Status 200, array de produtos retornado
RF13	Deletar um produto da lista	Código do produto	Status 200, confirmação de remoção
RF14	Adicionar produto com lista inexistente	Código inválido	Status 404, erro de lista não encontrada
RF15	Deletar produto inexistente	Código de produto inválido	Status 404, erro ao excluir

✅ 2. Casos de Teste – Requisitos Não Funcionais
🔹 2.1 Segurança
ID	Caso de Teste	Descrição	Resultado Esperado
RNF01	API só acessível com token JWT válido	Enviar requisição com token expirado	Status 401, mensagem de token inválido
RNF02	Senha armazenada com hash seguro	Registrar e verificar hash no banco	Senha não armazenada em texto puro
RNF03	Prevenção contra SQL Injection	Input com ' OR '1'='1	API deve tratar e não executar consulta maliciosa

🔹 2.2 Usabilidade
ID	Caso de Teste	Descrição	Resultado Esperado
RNF04	Interface com mensagens claras	Campos obrigatórios não preenchidos	Mensagem clara: “Preencha o campo X”
RNF05	Fluxo lógico do usuário	Registro → Login → Criar lista → Adicionar produto	Navegação sem falhas e com retorno coerente

🔹 2.3 Performance
ID	Caso de Teste	Descrição	Resultado Esperado
RNF06	Tempo de resposta da API	Todas as requisições abaixo de 1 segundo	95% dos casos ≤ 1s
RNF07	Teste de carga moderada	100 requisições simultâneas de login	API responde corretamente sem travar

🔹 2.4 Escalabilidade e Confiabilidade
ID	Caso de Teste	Descrição	Resultado Esperado
RNF08	Vários usuários acessando simultaneamente	Registro de 50 usuários em sequência	Nenhum erro de concorrência
RNF09	Persistência de dados	Criar lista e reiniciar API	Dados continuam disponíveis

🔹 2.5 Manutenibilidade e Testabilidade
ID	Caso de Teste	Descrição	Resultado Esperado
RNF10	Código com testes automatizados	Executar testes com Newman ou Jest	Todos os testes devem passar
RNF11	API documentada	Swagger ou Postman documentado	Desenvolvedores conseguem testar sem auxílio adicional

2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.

Registrando Usuário
![image](https://github.com/user-attachments/assets/2463a791-0b70-4f88-a46c-dbe9f23f5dd1)

Registrar usuário já existente
![image](https://github.com/user-attachments/assets/0e413765-263b-4c0b-9a4d-4acc4a6b7fad)

Logando com usuário existente
![image](https://github.com/user-attachments/assets/6590af07-9d2f-4fc9-beed-081f07dc05b9)

Tentando logar com usuário que não existe
![image](https://github.com/user-attachments/assets/0adf0d61-f75f-4906-acbc-5a0ed2012bec)

Criação de uma lista de compras com o token válido
![image](https://github.com/user-attachments/assets/ce77ee97-9644-4b49-9f6f-1154aaa0027c)

Tentando criar uma lista de compras com o token inválido ou não existente
![image](https://github.com/user-attachments/assets/27c95d89-92c1-4877-9348-355142193569)

Listando as listas existentes com token válido
![image](https://github.com/user-attachments/assets/e51be76e-1fec-4e8b-a2a8-5bb4cf7d10b0)

Tentando listar as listas sem token existente ou errado
![image](https://github.com/user-attachments/assets/0b44dbc3-8806-408e-a139-730d89a1afa0)

Criação de um produto em uma lista válida com token válido
![image](https://github.com/user-attachments/assets/5c556bf7-fcd4-4cf2-89fb-aff37f692ca6)

Tentando criar um produto em uma lista inválida com token válido
![image](https://github.com/user-attachments/assets/986368c2-210e-4e24-b3ab-f41613a426b6)

Tentando criar um produto em uma lista válida porém com token não válido ou não existente
![image](https://github.com/user-attachments/assets/f47094d5-1b8e-4b73-9543-72e35ce46fa6)

Listando produtos de uma lista existente
![image](https://github.com/user-attachments/assets/934dfa18-42a4-4e8d-b9a6-2917e1d58d7e)

Tentando listar produtos de uma lista que não existe
![image](https://github.com/user-attachments/assets/9b60be47-0867-4e22-a6bc-60a46e550cc9)

Deletando uma lista que existia
![image](https://github.com/user-attachments/assets/59e938cd-295d-4b83-8625-1ce16d28d34a)

Tentando deletar uma lista que não existe mais
![image](https://github.com/user-attachments/assets/269e3655-8839-4616-8dbc-283a5ceefc51)

Deletando um produto de uma lista que existe o produto
![image](https://github.com/user-attachments/assets/d6cbc83d-5aea-4eab-ba29-2ce92a2e194b)

Tentando deletar um produto de uma lista que existe mas o produto não
![image](https://github.com/user-attachments/assets/d791c255-9ce7-4188-ba3a-4cd6804f31d5)

Tentando deletar um produto com código existente em uma lista que não existe
![image](https://github.com/user-attachments/assets/808d9594-63d1-4713-a61c-1390443a1977)

3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
Etapa	Requisição
![image](https://github.com/user-attachments/assets/2f358f6f-bf52-4de8-9fa8-61c0deea9007)


4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
Teste de carga realizado com o Newman, foi realizado um teste de carga baixa de 10 interações e um teste de carga um pouco mais alta de 50 interações.
10 Interações
![image](https://github.com/user-attachments/assets/b7365a4c-768f-4af1-983b-5d8e62300883)

50 Interações
![image](https://github.com/user-attachments/assets/3c16cdeb-56dc-4cf6-96e0-47ace809b3fe)


