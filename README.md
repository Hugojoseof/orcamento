# 🏭 Gerador de Orçamentos - Barros Vidraçaria e Metalúrgica

Sistema profissional para geração de orçamentos desenvolvido para a **Barros Vidraçaria e Metalúrgica**, uma empresa familiar especializada em vidraçaria e metalurgia.

## 📋 Sobre o Projeto

Este sistema foi desenvolvido para ajudar na gestão de orçamentos da empresa, oferecendo uma solução completa e profissional para:

- ✅ **Geração rápida de orçamentos**
- ✅ **Visualização em tempo real**
- ✅ **Impressão profissional**
- ✅ **Salvamento em PDF**
- ✅ **Interface moderna e intuitiva**

## 🎯 Características Principais

### **📊 Gestão Completa de Orçamentos**
- Dados da empresa (Barros Vidraçaria e Metalúrgica)
- Informações do cliente
- Itens do orçamento com medidas e valores
- Resumo financeiro com descontos e acréscimos
- Observações e condições de pagamento

### **🎨 Interface Profissional**
- Design moderno e responsivo
- Layout compacto e organizado
- Cores e estilos profissionais
- Logo da empresa integrado

### **⚡ Funcionalidades Avançadas**
- **Geração automática** de números de orçamento
- **Cálculos automáticos** de valores
- **Validação flexível** - permite gerar mesmo sem dados
- **Dados padrão** para agilizar o processo
- **Histórico** de orçamentos salvos

### **📱 Responsividade**
- Funciona em desktop, tablet e mobile
- Interface adaptável a diferentes tamanhos de tela
- Otimizado para impressão

## 🚀 Como Usar

### **1. Instalação**
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta
cd orçamento

# Inicie o servidor local
python3 -m http.server 8000
```

### **2. Acesso**
- Abra o navegador
- Acesse: `http://localhost:8000`
- O sistema estará pronto para uso

### **3. Geração de Orçamento**
1. **Preencha os dados** (ou deixe vazio para usar padrões)
2. **Adicione itens** ao orçamento
3. **Ajuste valores** e condições
4. **Visualize** o orçamento
5. **Imprima** ou **salve como PDF**

## 🏗️ Estrutura do Projeto

```
orçamento/
├── index.html              # Página principal
├── src/
│   ├── css/
│   │   └── main.css        # Estilos principais
│   ├── js/
│   │   ├── app.js          # Aplicação principal
│   │   ├── modules/        # Módulos do sistema
│   │   │   ├── OrcamentoGenerator.js
│   │   │   ├── ItemManager.js
│   │   │   └── FormManager.js
│   │   ├── services/       # Serviços
│   │   │   ├── PDFService.js
│   │   │   ├── StorageService.js
│   │   │   └── NotificationService.js
│   │   └── utils/          # Utilitários
│   │       └── formatters.js
│   └── assets/
│       └── logo-barros.png # Logo da empresa
├── package.json            # Configurações do projeto
└── README.md              # Este arquivo
```

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos e responsivos
- **JavaScript ES6+** - Lógica da aplicação
- **Font Awesome** - Ícones profissionais
- **Google Fonts** - Tipografia moderna

## 📋 Funcionalidades Detalhadas

### **🏢 Dados da Empresa**
- Nome: Barros Vidraçaria e Metalúrgica
- CNPJ: 61.577.922/0001-50
- Endereço: Rua Augustinho Filozina N159 - Bairro Maria Emanuela - São Miguel-RN
- Telefone: (84) 9 9411-4275
- Instagram: @barrosvidracaria
- Logo da empresa integrado

### **👤 Dados do Cliente**
- Nome, telefone, email, CPF/CNPJ
- Endereço completo
- Cidade e estado

### **📦 Itens do Orçamento**
- Descrição detalhada do produto/serviço
- Quantidade e medidas (altura x largura)
- Valor unitário e total
- Adição/remoção dinâmica de itens

### **💰 Resumo Financeiro**
- Subtotal automático
- Desconto em porcentagem
- Acréscimos em valor
- Total final calculado

### **📝 Observações**
- Forma de pagamento
- Condições especiais
- Prazo de entrega
- Observações adicionais

## 🖨️ Impressão e PDF

### **Visualização**
- Modal com preview completo
- Layout idêntico ao impresso
- Botão de fechar integrado

### **Impressão**
- Estilos otimizados para impressão
- Layout profissional
- Cores e fontes adequadas

### **PDF**
- Salvamento direto como PDF
- Qualidade profissional
- Compatível com todos os sistemas

## 🔧 Configurações

### **Dados Padrão**
O sistema inclui dados padrão para agilizar o processo:
- Informações da empresa pré-preenchidas
- Valores padrão para campos obrigatórios
- Mensagens informativas quando necessário

### **Validação Flexível**
- Permite gerar orçamentos mesmo sem dados
- Usa valores padrão automaticamente
- Não bloqueia a geração por campos vazios

## 📱 Compatibilidade

- ✅ **Chrome** (recomendado)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ✅ **Mobile browsers**

## 🤝 Contribuição

Este projeto foi desenvolvido para uso específico da **Barros Vidraçaria e Metalúrgica**. Para sugestões ou melhorias, entre em contato.

## 📞 Contato

**Barros Vidraçaria e Metalúrgica**
- 📞 Telefone: (84) 9 9411-4275
- 📷 Instagram: @barrosvidracaria
- 📍 Endereço: Rua Augustinho Filozina N159 - Bairro Maria Emanuela - São Miguel-RN

---

**Desenvolvido com ❤️ para ajudar na gestão da empresa familiar** 