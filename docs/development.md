
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
