/**
 * Gerador de Orçamentos - Módulo Principal
 * Gerencia toda a lógica de criação e manipulação de orçamentos
 */

import { Formatters } from '../utils/formatters.js';
import { ItemManager } from './ItemManager.js';
import { FormManager } from './FormManager.js';
import { PDFService } from '../services/PDFService.js';

export class OrcamentoGenerator {
    constructor(notificationService, storageService) {
        this.notificationService = notificationService;
        this.storageService = storageService;
        this.itemManager = null;
        this.formManager = null;
        this.pdfService = null;
        this.isInitialized = false;
    }

    /**
     * Inicializa o gerador de orçamentos
     */
    init() {
        try {
            console.log('🔧 Inicializando Gerador de Orçamentos...');
            
            // Inicializar sub-módulos
            this.itemManager = new ItemManager(this);
            this.formManager = new FormManager(this);
            this.pdfService = new PDFService(this);
            
            // Configurar data padrão
            this.setDefaultDate();
            
            // Gerar número do orçamento
            this.generateOrcamentoNumber();
            
            // Adicionar item inicial
            this.itemManager.addInitialItem();
            
            // Configurar event listeners
            this.setupEventListeners();
            this.setupModalEvents();
            
            this.isInitialized = true;
            console.log('✅ Gerador de Orçamentos inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Gerador de Orçamentos:', error);
            this.notificationService.error('Erro ao inicializar o sistema');
        }
    }

    /**
     * Configura os event listeners principais
     */
    setupEventListeners() {
        // Botões principais
        this.addButtonListener('previewBtn', () => this.previewOrcamento());
        this.addButtonListener('printBtn', () => this.printOrcamento());
        this.addButtonListener('saveBtn', () => this.saveOrcamento());
        this.addButtonListener('clearBtn', () => this.clearForm());
        this.addButtonListener('addItem', () => this.itemManager.addItem());

        // Modal
        this.setupModalListeners();

        // Cálculos automáticos
        this.addInputListener('descontoPercentual', () => this.calculateTotals());
        this.addInputListener('acrescimoValor', () => this.calculateTotals());
    }

    /**
     * Adiciona listener para botão
     */
    addButtonListener(buttonId, callback) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', callback);
        } else {
            console.warn(`⚠️ Botão ${buttonId} não encontrado`);
        }
    }

    /**
     * Adiciona listener para input
     */
    addInputListener(inputId, callback) {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', callback);
        } else {
            console.warn(`⚠️ Input ${inputId} não encontrado`);
        }
    }

    /**
     * Configura listeners do modal
     */
    setupModalListeners() {
        const modal = document.getElementById('previewModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    /**
     * Define data padrão
     */
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dataInput = document.getElementById('orcamentoData');
        if (dataInput) {
            dataInput.value = today;
        }
    }

    /**
     * Gera número do orçamento
     */
    generateOrcamentoNumber() {
        const nextNumber = this.storageService.getNextOrcamentoNumber();
        const numeroInput = document.getElementById('orcamentoNumero');
        if (numeroInput) {
            numeroInput.value = nextNumber;
        }
    }

    /**
     * Calcula totais
     */
    calculateTotals() {
        try {
            let subtotal = 0;
            const items = document.querySelectorAll('.item-row');
            
            items.forEach(item => {
                const quantidade = parseFloat(item.querySelector('.item-quantidade').value) || 0;
                const valor = parseFloat(item.querySelector('.item-valor').value) || 0;
                const total = quantidade * valor;
                
                item.querySelector('.item-total').textContent = Formatters.formatCurrency(total);
                subtotal += total;
            });

            // Atualizar subtotal
            this.updateElement('subtotal', Formatters.formatCurrency(subtotal));

            // Calcular desconto
            const descontoPercentual = parseFloat(document.getElementById('descontoPercentual').value) || 0;
            const descontoValor = subtotal * (descontoPercentual / 100);
            this.updateElement('descontoValor', Formatters.formatCurrency(descontoValor));

            // Calcular acréscimo
            const acrescimoValor = parseFloat(document.getElementById('acrescimoValor').value) || 0;

            // Calcular total
            const total = subtotal - descontoValor + acrescimoValor;
            this.updateElement('total', Formatters.formatCurrency(total));

        } catch (error) {
            console.error('❌ Erro ao calcular totais:', error);
        }
    }

    /**
     * Atualiza elemento na tela
     */
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Obtém dados do formulário
     */
    getFormData() {
        return {
            empresa: {
                nome: this.getInputValue('empresaNome') || 'BARROS VIDRAÇARIA E METALÚRGICA',
                cnpj: this.getInputValue('empresaCnpj') || '00.000.000/0000-00',
                endereco: this.getInputValue('empresaEndereco') || 'Rua Augustinho Filozina - Maria Emanuela',
                telefone: this.getInputValue('empresaTelefone') || '84 9 9411-4275',
                email: this.getInputValue('empresaEmail') || 'contato@barrosvidracaria.com.br',
                site: this.getInputValue('empresaSite') || 'www.barrosvidracaria.com.br'
            },
            cliente: {
                nome: this.getInputValue('clienteNome') || 'Cliente',
                telefone: this.getInputValue('clienteTelefone') || '(00) 00000-0000',
                cpf: this.getInputValue('clienteCpf') || '000.000.000-00',
                email: this.getInputValue('clienteEmail') || 'cliente@email.com',
                endereco: this.getInputValue('clienteEndereco') || 'Endereço do cliente',
                cidade: this.getInputValue('clienteCidade') || 'Cidade - Estado'
            },
            orcamento: {
                numero: this.getInputValue('orcamentoNumero') || '001',
                data: this.getInputValue('orcamentoData') || new Date().toISOString().split('T')[0],
                validade: this.getInputValue('orcamentoValidade') || '30',
                vendedor: this.getInputValue('orcamentoVendedor') || 'Vendedor'
            },
            items: this.itemManager.getItemsData(),
            financeiro: {
                subtotal: this.parseCurrencyValue('subtotal'),
                descontoPercentual: parseFloat(this.getInputValue('descontoPercentual')) || 0,
                descontoValor: this.parseCurrencyValue('descontoValor'),
                acrescimoValor: parseFloat(this.getInputValue('acrescimoValor')) || 0,
                total: this.parseCurrencyValue('total')
            },
            observacoes: {
                formaPagamento: this.getInputValue('formaPagamento') || 'A combinar',
                condicoes: this.getInputValue('condicoes') || 'Condições a combinar',
                prazoEntrega: this.getInputValue('prazoEntrega') || 'Prazo a combinar',
                observacoes: this.getInputValue('observacoes') || 'Observações adicionais'
            }
        };
    }

    /**
     * Obtém valor de input
     */
    getInputValue(inputId) {
        const input = document.getElementById(inputId);
        return input ? input.value : '';
    }

    /**
     * Converte valor monetário para número
     */
    parseCurrencyValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return 0;
        
        const value = element.textContent.replace('R$', '').replace('.', '').replace(',', '.');
        return parseFloat(value) || 0;
    }

    /**
     * Valida dados do orçamento (versão flexível)
     */
    validateOrcamentoData(data) {
        // Sem validação - sempre permite gerar
        return true;
    }

    /**
     * Visualiza orçamento
     */
    previewOrcamento() {
        try {
            const data = this.getFormData();
            
            if (!this.validateOrcamentoData(data)) {
                return;
            }
            
            const preview = this.generateOrcamentoHTML(data);
            const previewElement = document.getElementById('orcamentoPreview');
            
            if (previewElement) {
                previewElement.innerHTML = preview;
            }
            
            const modal = document.getElementById('previewModal');
            if (modal) {
                modal.style.display = 'block';
            }
            
            this.notificationService.success('Orçamento visualizado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao visualizar orçamento:', error);
            this.notificationService.error('Erro ao visualizar orçamento');
        }
    }

    /**
     * Imprime orçamento
     */
    printOrcamento() {
        try {
            const data = this.getFormData();
            
            if (!this.validateOrcamentoData(data)) {
                return;
            }
            
            this.pdfService.printOrcamento(data);
            
        } catch (error) {
            console.error('❌ Erro ao imprimir orçamento:', error);
            this.notificationService.error('Erro ao imprimir orçamento');
        }
    }

    /**
     * Salva orçamento como PDF
     */
    async saveOrcamento() {
        try {
            const data = this.getFormData();
            
            if (!this.validateOrcamentoData(data)) {
                return;
            }
            
            this.notificationService.info('Gerando PDF...');
            
            // Abrir modal para capturar conteúdo
            this.previewOrcamento();
            
            setTimeout(() => {
                this.pdfService.saveAsPDF(data);
            }, 500);
            
        } catch (error) {
            console.error('❌ Erro ao salvar orçamento:', error);
            this.notificationService.error('Erro ao salvar orçamento');
        }
    }

    /**
     * Limpa formulário
     */
    clearForm() {
        try {
            if (confirm('Tem certeza que deseja limpar todos os dados?')) {
                this.formManager.clearForm();
                this.itemManager.clearItems();
                this.generateOrcamentoNumber();
                this.setDefaultDate();
                this.notificationService.success('Formulário limpo com sucesso');
            }
        } catch (error) {
            console.error('❌ Erro ao limpar formulário:', error);
            this.notificationService.error('Erro ao limpar formulário');
        }
    }

    /**
     * Gera HTML do orçamento
     */
    generateOrcamentoHTML(data) {
        const dataEmissao = Formatters.formatDate(data.orcamento.data);
        const dataValidade = new Date(data.orcamento.data);
        dataValidade.setDate(dataValidade.getDate() + parseInt(data.orcamento.validade));
        const dataValidadeStr = Formatters.formatDate(dataValidade);

        return `
            <div class="orcamento-print">
                <div class="orcamento-header">
                    <div class="empresa-info">
                        <div class="empresa-logo-container">
                            <img src="src/assets/logo-barros.png" alt="Logo Barros" class="empresa-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="empresa-logo-fallback" style="display: none;">
                                <i class="fas fa-building"></i>
                            </div>
                        </div>
                        <div class="empresa-detalhes">
                            <h1>${data.empresa.nome}</h1>
                            <div class="empresa-contato">
                                <span><i class="fas fa-id-card"></i> CNPJ: ${Formatters.formatCPFCNPJ(data.empresa.cnpj)}</span>
                                <span><i class="fas fa-map-marker-alt"></i> ${data.empresa.endereco}</span>
                                <span><i class="fas fa-phone"></i> ${Formatters.formatPhone(data.empresa.telefone)}</span>
                                <span><i class="fas fa-envelope"></i> ${data.empresa.email}</span>
                                ${data.empresa.site ? `<span><i class="fas fa-globe"></i> ${data.empresa.site}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="documento-info">
                    <div class="doc-left">
                        <h2>ORÇAMENTO</h2>
                        <p>Nº ${Formatters.formatOrcamentoNumber(data.orcamento.numero)}</p>
                        <p>Emitido em: ${dataEmissao}</p>
                        <p>Válido até: ${dataValidadeStr}</p>
                        ${data.orcamento.vendedor ? `<p>Vendedor: ${data.orcamento.vendedor}</p>` : ''}
                    </div>
                    <div class="doc-right">
                        <p><strong>Data:</strong> ${dataEmissao}</p>
                        <p><strong>Validade:</strong> ${data.orcamento.validade} dias</p>
                        <p><strong>Página:</strong> 1 de 1</p>
                    </div>
                </div>

                <div class="cliente-info">
                    <h3>DADOS DO CLIENTE</h3>
                    <div class="cliente-grid">
                        <div><strong>Nome:</strong> ${data.cliente.nome}</div>
                        <div><strong>Telefone:</strong> ${Formatters.formatPhone(data.cliente.telefone)}</div>
                        <div><strong>Email:</strong> ${data.cliente.email || '-'}</div>
                        <div><strong>CPF/CNPJ:</strong> ${Formatters.formatCPFCNPJ(data.cliente.cpf)}</div>
                        <div><strong>Endereço:</strong> ${data.cliente.endereco}</div>
                        <div><strong>Cidade:</strong> ${data.cliente.cidade}</div>
                    </div>
                </div>

                ${this.generateItemsTable(data.items)}

                ${this.generateFinancialSummary(data.financeiro)}

                ${this.generateObservations(data.observacoes)}

                <div class="assinaturas">
                    <div class="assinatura">
                        <div class="assinatura-line"></div>
                        <p>Cliente</p>
                    </div>
                    <div class="assinatura">
                        <div class="assinatura-line"></div>
                        <p>Responsável</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Gera tabela de itens
     */
    generateItemsTable(items) {
        if (!items || items.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1; margin: 20px 0;">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: #94a3b8; margin-bottom: 15px;"></i>
                    <h3 style="color: #64748b; margin-bottom: 10px;">Nenhum item adicionado</h3>
                    <p style="color: #94a3b8; font-size: 0.9rem;">Adicione itens ao orçamento para ver os detalhes aqui</p>
                </div>
            `;
        }

        let tableHTML = `
            <table class="itens-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qtd</th>
                        <th>Medidas</th>
                        <th>Descrição</th>
                        <th>Valor Unit.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        items.forEach((item, index) => {
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.quantidade}</td>
                    <td>${Formatters.formatMedidas(item.altura, item.largura)}</td>
                    <td>${item.descricao}</td>
                    <td>${Formatters.formatCurrency(item.valor)}</td>
                    <td>${Formatters.formatCurrency(item.total)}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        return tableHTML;
    }

    /**
     * Gera resumo financeiro
     */
    generateFinancialSummary(financeiro) {
        return `
            <div class="resumo-financeiro">
                <h3>RESUMO FINANCEIRO</h3>
                ${financeiro.subtotal > 0 ? `<div class="resumo-item"><span>Subtotal:</span><span>${Formatters.formatCurrency(financeiro.subtotal)}</span></div>` : ''}
                ${financeiro.descontoValor > 0 ? `<div class="resumo-item"><span>Desconto:</span><span>${Formatters.formatCurrency(financeiro.descontoValor)}</span></div>` : ''}
                ${financeiro.acrescimoValor > 0 ? `<div class="resumo-item"><span>Acréscimo:</span><span>${Formatters.formatCurrency(financeiro.acrescimoValor)}</span></div>` : ''}
                <div class="resumo-item total"><span>TOTAL:</span><span>${Formatters.formatCurrency(financeiro.total)}</span></div>
            </div>
        `;
    }

    /**
     * Gera seção de observações
     */
    generateObservations(observacoes) {
        return `
            <div class="observacoes">
                <h3>OBSERVAÇÕES</h3>
                <div class="obs-grid">
                    <div><strong>Forma de Pagamento:</strong> ${observacoes.formaPagamento || 'A combinar'}</div>
                    <div><strong>Condições:</strong> ${observacoes.condicoes || 'Condições a combinar'}</div>
                    <div><strong>Prazo de Entrega:</strong> ${observacoes.prazoEntrega || 'Prazo a combinar'}</div>
                    <div><strong>Observações:</strong> ${observacoes.observacoes || 'Observações adicionais'}</div>
                </div>
            </div>
        `;
    }

    /**
     * Fecha o modal
     */
    closeModal() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Configura eventos do modal
     */
    setupModalEvents() {
        const modal = document.getElementById('previewModal');
        const closeBtn = modal?.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Fechar modal ao clicar fora dele
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }
} 