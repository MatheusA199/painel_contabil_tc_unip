# 📊 Sistema de Gestão Contábil para Microempreendedores

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

> Uma solução web completa para otimizar o gerenciamento de estoques, custos e vendas de pequenos negócios, fundamentada nos princípios contábeis do CPC 16.

---

## 🖼️ Visão Geral do Projeto

Este projeto foi desenvolvido como Trabalho de Curso (TC) com o objetivo de democratizar o acesso a ferramentas de gestão contábil. Focado na realidade de microempreendedores (como vendedores autônomos de alimentos), o sistema substitui anotações manuais e "achismos" por dados precisos.

**Diferencial:** O sistema não apenas registra dados, mas aplica lógica contábil real (como o método de custeio e validação de estoque) para gerar uma **Demonstração do Resultado do Exercício (DRE)** automática e em tempo real.

### 📸 Screenshots

| Painel Financeiro (DRE) | Controle de Estoque |
|:---:|:---:|
| ![DRE]([https://github.com/MatheusA199/painel_contabil_tc_unip/issues/3#issue-3596865487](https://private-user-images.githubusercontent.com/106098490/510915557-aabe4751-ddfc-408f-ad51-7c1f5d103a92.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjI0NTE2NDUsIm5iZiI6MTc2MjQ1MTM0NSwicGF0aCI6Ii8xMDYwOTg0OTAvNTEwOTE1NTU3LWFhYmU0NzUxLWRkZmMtNDA4Zi1hZDUxLTdjMWY1ZDEwM2E5Mi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMTA2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTEwNlQxNzQ5MDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1kNTNiYmUyYjBlZGYyNmY2YmM2NTRhMjU2Y2Q2MzNhNjljYzcyMGNmZWQ1NmI5MDQyMmM4ZWNjN2UyYzdhYjMyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.TEcGxG1oALpt0FjcWL9C5h4vJJ8ebNyZJUHMVsj_JIU)) | ![Estoque](https://github.com/MatheusA199/painel_contabil_tc_unip/issues/2#issue-3596863884) |
| *Visão clara do lucro líquido real.* | *Saldo atualizado automaticamente.* |

| Histórico de Vendas | Registro de Produção |
|:---:|:---:|
| ![Vendas](https://github.com/MatheusA199/painel_contabil_tc_unip/issues/1#issue-3596862991) | ![Produção](https://github.com/MatheusA199/painel_contabil_tc_unip/issues/4#issue-3596866109) |
| *Detalhamento de todas as transações.* | *Baixa automática de insumos.* |

---

## ✨ Funcionalidades Principais

* **🔐 Autenticação & Multi-tenancy:** Sistema seguro onde cada usuário visualiza apenas os seus próprios dados.
* **📦 Gestão de Cadastros:**
    * Insumos (Matéria-prima com unidades de medida personalizadas).
    * Produtos Finais (Com definição de preço de venda e rendimento por receita).
    * Receitas Dinâmicas (Associação de múltiplos insumos a um produto).
* **🏭 Controle Operacional:**
    * **Registro de Compras:** Entrada automática no estoque de insumos.
    * **Registro de Produção Inteligente:** Valida se há estoque suficiente de *todos* os ingredientes antes de permitir a produção. Realiza a baixa dos insumos e a entrada do produto acabado automaticamente.
    * **Registro de Vendas:** Cálculo automático de faturamento e baixa de estoque de produtos.
    * **Controle de Perdas:** Registro tipificado (vencimento, consumo próprio) para apuração correta de despesas.
* **📈 Inteligência de Negócio:**
    * **DRE em Tempo Real:** Relatório financeiro com Receita Bruta, CMV (Custo da Mercadoria Vendida), Lucro Bruto, Despesas e Lucro Líquido.
    * **Cálculo de Custo Preciso:** Utilização de algoritmos para apurar o custo unitário real de cada produto baseado no histórico de compras de insumos.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com uma stack moderna, focada em performance e escalabilidade:

* **[Next.js 14 (App Router)](https://nextjs.org/):** Framework React full-stack, utilizando *Server Actions* para toda a lógica de backend e *React Server Components* para máxima eficiência.
* **[Prisma ORM](https://www.prisma.io/):** Para interação tipada e segura com o banco de dados.
* **[PostgreSQL](https://www.postgresql.org/):** Banco de dados relacional robusto (hospedado na Vercel/Neon durante o desenvolvimento).
* **[NextAuth.js](https://next-auth.js.org/):** Sistema completo de autenticação e gerenciamento de sessões.
* **[Tailwind CSS](https://tailwindcss.com/) & [HeroUI](https://www.heroui.com/):** Para estilização responsiva e componentes de interface modernos.
* **Zod:** Para validação robusta de dados no backend.

---

## 🗄️ Modelagem do Banco de Dados

A estrutura relacional foi projetada para garantir a integridade das transações e suportar o método de custeio.

```mermaid
erDiagram
    User ||--o{ Insumo : "cadastra"
    User ||--o{ Produto : "cadastra"
    User ||--o{ CompraInsumo : "registra"
    User ||--o{ Producao : "realiza"
    User ||--o{ Venda : "realiza"
    User ||--o{ Perda : "registra"
    User ||--o{ EstoqueMovimentacao : "audita"

    Insumo ||--o{ ReceitaItem : "compõe"
    Produto ||--o{ ReceitaItem : "possui"
    
    Insumo ||--o{ CompraInsumo : "é comprado"
    Produto ||--o{ Producao : "é fabricado"
    Produto ||--o{ Venda : "é vendido"
    
    Insumo }o--o{ EstoqueMovimentacao : "movimenta"
    Produto }o--o{ EstoqueMovimentacao : "movimenta"
