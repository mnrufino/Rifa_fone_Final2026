# Rifa Beneficente - 200 Números

Página web estática para rifa com painel básico de administrador.

## Recursos

- Seleção de vários números para a mesma pessoa
- Salva número, nome, telefone e data no navegador
- Lista de compradores no painel do administrador
- Exportação para CSV, que abre no Excel
- Remoção individual de número vendido
- Limpeza completa da rifa
- Envio da participação pelo WhatsApp

## Senha do administrador

Senha padrão:

```txt
1234
```

Para alterar, abra `script.js` e mude:

```js
const SENHA_ADMIN = "1234";
```

## Importante

Os dados ficam salvos apenas no navegador usado para registrar as vendas.

Para salvar online e acessar de qualquer celular/computador, será necessário usar banco de dados como Firebase, Supabase ou Google Sheets com Apps Script.

## GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html`, `style.css`, `script.js` e `README.md`.
3. Vá em Settings > Pages.
4. Selecione a branch `main`.
5. Clique em Save.
