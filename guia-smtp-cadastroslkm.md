# 📧 Guia Completo: Configuração SMTP no Supabase
**E-mail:** cadastroslkm@gmail.com

---

## 🎯 Objetivo
Configurar o e-mail **cadastroslkm@gmail.com** para enviar notificações de recuperação de senha e confirmação de cadastro aos professores e gestores do Portal Lydia Kitz.

---

## 📋 Parte 1: Gerar Senha de App no Gmail

> [!WARNING]
> **IMPORTANTE:** Você precisará ter acesso à conta **cadastroslkm@gmail.com** para completar esta etapa.

### Passo 1: Ativar Verificação em 2 Etapas

1. Acesse: **https://myaccount.google.com/security**
2. Faça login com **cadastroslkm@gmail.com**
3. Role até encontrar **"Verificação em duas etapas"**
4. Clique em **"Verificação em duas etapas"**
5. Siga as instruções para ativar (se ainda não estiver ativada)
6. Você precisará confirmar com SMS ou outro método

### Passo 2: Criar Senha de App

1. Ainda em **https://myaccount.google.com/security**
2. Role até **"Verificação em duas etapas"** e clique
3. Role até o final da página
4. Encontre **"Senhas de app"** e clique
5. Pode pedir para fazer login novamente - faça
6. Em **"Selecionar app"**, escolha **"Outro (nome personalizado)"**
7. Digite: **Supabase - Portal Lydia Kitz**
8. Clique em **"Gerar"**
9. **COPIE A SENHA DE 16 CARACTERES** que aparecer
   - Formato: `xxxx xxxx xxxx xxxx` (sem espaços na hora de usar)

> [!CAUTION]
> **GUARDE BEM ESTA SENHA!** Ela só aparece uma vez!

---

## 📋 Parte 2: Configurar SMTP no Supabase

### Passo 1: Acessar Configurações do Supabase

1. Acesse: **https://app.supabase.com/project/zvuxzrfbmmbhuhwaofrn/settings/auth**
2. Faça login na sua conta Supabase
3. Role até encontrar a seção **"SMTP Settings"**

### Passo 2: Preencher Configurações SMTP

Preencha os campos **exatamente** como abaixo:

```
┌─────────────────────────────────────────────────┐
│ SMTP Settings                                    │
├─────────────────────────────────────────────────┤
│ Enable Custom SMTP:  [✓] Habilitado             │
│                                                  │
│ Host:               smtp.gmail.com               │
│ Port:               587                          │
│ Username:           cadastroslkm@gmail.com       │
│ Password:           [Cole a senha de app aqui]   │
│ Sender Email:       cadastroslkm@gmail.com       │
│ Sender Name:        Portal Lydia Kitz - Cadastros│
└─────────────────────────────────────────────────┘
```

#### Detalhes de Cada Campo:

| Campo | Valor | Observação |
|-------|-------|------------|
| **Enable Custom SMTP** | ✓ Habilitado | Marque a caixa |
| **Host** | `smtp.gmail.com` | Servidor SMTP do Gmail |
| **Port** | `587` | Porta TLS (recomendada) |
| **Username** | `cadastroslkm@gmail.com` | E-mail completo |
| **Password** | [Senha de app] | Cole SEM ESPAÇOS<br>Ex: `abcdefghijklmnop` |
| **Sender Email** | `cadastroslkm@gmail.com` | E-mail que aparece como remetente |
| **Sender Name** | `Portal Lydia Kitz - Cadastros` | Nome que aparece no e-mail |

> [!IMPORTANT]
> **Senha de App:** Se a senha mostrada foi `abcd efgh ijkl mnop`, cole como `abcdefghijklmnop` (sem espaços)

### Passo 3: Salvar Configurações

1. Clique no botão **"Save"** no final da seção
2. Aguarde a confirmação de que foi salvo com sucesso

---

## 📋 Parte 3: Testar se Está Funcionando

### Teste 1: Interface de Login

1. Abra o portal em: **https://plataforma-ocorrencias-lydia.netlify.app/**
2. Clique em **"Esqueci minha senha"**
3. Digite um e-mail de professor cadastrado (exemplo: `lutti@prof.educacao.sp.gov.br`)
4. Clique em **"Enviar link de recuperação"**
5. Verifique a caixa de entrada do e-mail do professor
   - O e-mail deve chegar em 1-2 minutos
   - Verifique também a pasta de **SPAM/Lixeira**

### Teste 2: Verificar Logs do Supabase

1. Acesse: **https://app.supabase.com/project/zvuxzrfbmmbhuhwaofrn/logs/auth-logs**
2. Procure por eventos recentes de `password_recovery`
3. Verifique se há erros relacionados ao SMTP

---

## ✅ Confirmação de Sucesso

Você saberá que está funcionando quando:

- ✅ E-mail de recuperação chegar na caixa de entrada do professor
- ✅ Remetente aparecer como **"Portal Lydia Kitz - Cadastros"** ou **cadastroslkm@gmail.com**
- ✅ Link de redefinição funcionar ao clicar

---

## ⚠️ Possíveis Problemas e Soluções

### Problema 1: "Autenticação SMTP falhou"

**Solução:**
- Verifique se a senha de app foi copiada corretamente (sem espaços)
- Confirme que a verificação em 2 etapas está ativada no Gmail
- Tente gerar uma nova senha de app

### Problema 2: E-mail cai no SPAM

**Solução:**
- É normal na primeira vez
- Peça aos professores para marcarem como **"Não é spam"**
- Com o tempo, o Gmail aprende e para de marcar como spam

### Problema 3: E-mail não chega

**Solução:**
- Verifique os logs do Supabase
- Confirme que o SMTP está habilitado
- Tente reenviar o e-mail de recuperação
- Verifique se a conta Gmail está ativa e sem bloqueios

### Problema 4: "Senha de app inválida"

**Solução:**
- Gere uma nova senha de app
- Exclua a antiga (se existir)
- Configure novamente no Supabase com a nova senha

### Problema 5: "Limite de envio excedido"

**Solução:**
- Aguarde 24 horas para o limite resetar
- Considere usar SendGrid ou outro serviço para volumes maiores

---

## 📊 Limites do Gmail

| Limite | Valor | Observação |
|--------|-------|------------|
| **E-mails/dia** | ~500 e-mails | Mais que suficiente para recuperação de senha |
| **E-mails/hora** | ~100 e-mails | Limite de segurança do Gmail |

> [!NOTE]
> Se precisar de volumes maiores, considere migrar para **SendGrid**, **AWS SES** ou **Mailgun**

---

## 🔒 Segurança

- ✅ Senha de app **não é** a senha da conta Gmail
- ✅ Pode ser revogada a qualquer momento
- ✅ Usada apenas para SMTP
- ✅ Não dá acesso à conta completa
- ✅ Se a senha de app for comprometida, você pode deletá-la sem afetar a conta Gmail

---

## 📝 Checklist de Configuração

Use este checklist para garantir que tudo foi feito:

- [ ] Verificação em 2 etapas ativada no Gmail
- [ ] Senha de app gerada
- [ ] Senha de app copiada (sem espaços)
- [ ] SMTP habilitado no Supabase
- [ ] Host configurado: `smtp.gmail.com`
- [ ] Port configurado: `587`
- [ ] Username configurado: `cadastroslkm@gmail.com`
- [ ] Password colado (senha de app sem espaços)
- [ ] Sender Email configurado: `cadastroslkm@gmail.com`
- [ ] Sender Name configurado: `Portal Lydia Kitz - Cadastros`
- [ ] Configurações salvas
- [ ] Teste de recuperação de senha realizado
- [ ] E-mail recebido com sucesso

---

## 📞 Precisa de Ajuda?

Se tiver algum problema durante a configuração:

1. Verifique os **logs do Supabase** para mensagens de erro específicas
2. Confirme que a senha de app está correta
3. Teste enviar um e-mail de teste usando outro serviço SMTP para garantir que o Gmail está funcionando
4. Entre em contato com o suporte

---

## 🎉 Pronto!

Após seguir todos os passos, o sistema estará enviando e-mails de:
- 🔑 Recuperação de senha
- ✉️ Confirmação de cadastro
- 📧 Notificações do sistema

**Remetente:** Portal Lydia Kitz - Cadastros (cadastroslkm@gmail.com)

Boa sorte! 🚀
