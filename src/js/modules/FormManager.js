/**
 * Gerenciador de Formulário
 * Gerencia a manipulação e validação do formulário
 */

export class FormManager {
    constructor(orcamentoGenerator) {
        this.orcamentoGenerator = orcamentoGenerator;
    }

    /**
     * Limpa o formulário
     */
    clearForm() {
        try {
            // Limpar dados da empresa
            this.clearSection('empresa');
            
            // Limpar dados do cliente
            this.clearSection('cliente');
            
            // Limpar dados do orçamento
            this.clearSection('orcamento');
            
            // Limpar campos financeiros
            this.clearFinancialFields();
            
            // Limpar observações
            this.clearSection('observacoes');
            
            console.log('✅ Formulário limpo com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao limpar formulário:', error);
        }
    }

    /**
     * Limpa uma seção específica
     */
    clearSection(section) {
        const inputs = document.querySelectorAll(`[id^="${section}"]`);
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'email' || input.type === 'number') {
                input.value = '';
            } else if (input.type === 'textarea') {
                input.value = '';
            }
        });
    }

    /**
     * Limpa campos financeiros
     */
    clearFinancialFields() {
        const financialFields = ['descontoPercentual', 'acrescimoValor'];
        financialFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });

        // Limpar campos de exibição
        const displayFields = ['subtotal', 'descontoValor', 'total'];
        displayFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.textContent = 'R$ 0,00';
            }
        });
    }

    /**
     * Carrega dados no formulário
     */
    loadFormData(data) {
        try {
            if (!data) return false;

            // Carregar dados da empresa
            if (data.empresa) {
                this.loadSectionData('empresa', data.empresa);
            }

            // Carregar dados do cliente
            if (data.cliente) {
                this.loadSectionData('cliente', data.cliente);
            }

            // Carregar dados do orçamento
            if (data.orcamento) {
                this.loadSectionData('orcamento', data.orcamento);
            }

            // Carregar dados financeiros
            if (data.financeiro) {
                this.loadFinancialData(data.financeiro);
            }

            // Carregar observações
            if (data.observacoes) {
                this.loadSectionData('observacoes', data.observacoes);
            }

            // Recalcular totais
            this.orcamentoGenerator.calculateTotals();

            console.log('✅ Dados carregados no formulário');
            return true;

        } catch (error) {
            console.error('❌ Erro ao carregar dados no formulário:', error);
            return false;
        }
    }

    /**
     * Carrega dados de uma seção
     */
    loadSectionData(section, data) {
        Object.keys(data).forEach(key => {
            const fieldId = `${section}${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const field = document.getElementById(fieldId);
            if (field && data[key] !== undefined && data[key] !== null) {
                field.value = data[key];
            }
        });
    }

    /**
     * Carrega dados financeiros
     */
    loadFinancialData(financeiro) {
        if (financeiro.descontoPercentual !== undefined) {
            const field = document.getElementById('descontoPercentual');
            if (field) field.value = financeiro.descontoPercentual;
        }

        if (financeiro.acrescimoValor !== undefined) {
            const field = document.getElementById('acrescimoValor');
            if (field) field.value = financeiro.acrescimoValor;
        }
    }

    /**
     * Salva dados do formulário
     */
    saveFormData() {
        try {
            const data = this.orcamentoGenerator.getFormData();
            return this.orcamentoGenerator.storageService.saveOrcamento(data);
        } catch (error) {
            console.error('❌ Erro ao salvar dados do formulário:', error);
            return false;
        }
    }

    /**
     * Carrega dados salvos
     */
    loadSavedData() {
        try {
            const data = this.orcamentoGenerator.storageService.loadOrcamento();
            if (data) {
                return this.loadFormData(data);
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao carregar dados salvos:', error);
            return false;
        }
    }

    /**
     * Valida campos obrigatórios
     */
    validateRequiredFields() {
        const requiredFields = [
            'empresaNome',
            'empresaCnpj',
            'empresaEndereco',
            'empresaTelefone',
            'empresaInstagram',
            'clienteNome',
            'clienteTelefone',
            'clienteCpf',
            'clienteEndereco',
            'orcamentoNumero',
            'orcamentoData',
            'orcamentoValidade'
        ];

        const errors = [];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && (!field.value || field.value.trim() === '')) {
                errors.push(this.getFieldLabel(fieldId));
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Obtém label do campo
     */
    getFieldLabel(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            const label = field.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                return label.textContent.replace('*', '').trim();
            }
        }
        return fieldId;
    }

    /**
     * Marca campos com erro
     */
    markFieldsWithError(fields) {
        // Limpar marcações anteriores
        this.clearFieldErrors();

        // Marcar campos com erro
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.classList.add('error');
                field.style.borderColor = '#ef4444';
            }
        });
    }

    /**
     * Limpa marcações de erro
     */
    clearFieldErrors() {
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });
    }

    /**
     * Aplica máscara de CPF/CNPJ
     */
    applyCPFCNPJMask(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            // CPF
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            // CNPJ
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        
        input.value = value;
    }

    /**
     * Aplica máscara de telefone
     */
    applyPhoneMask(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        
        input.value = value;
    }

    /**
     * Aplica máscara de CNPJ
     */
    applyCNPJMask(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        input.value = value;
    }

    /**
     * Configura máscaras de input
     */
    setupInputMasks() {
        // CPF/CNPJ do cliente
        const clienteCpf = document.getElementById('clienteCpf');
        if (clienteCpf) {
            clienteCpf.addEventListener('input', (e) => this.applyCPFCNPJMask(e.target));
        }

        // CNPJ da empresa
        const empresaCnpj = document.getElementById('empresaCnpj');
        if (empresaCnpj) {
            empresaCnpj.addEventListener('input', (e) => this.applyCNPJMask(e.target));
        }

        // Telefones
        const telefones = ['empresaTelefone', 'clienteTelefone'];
        telefones.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => this.applyPhoneMask(e.target));
            }
        });
    }

    /**
     * Obtém estatísticas do formulário
     */
    getFormStats() {
        const data = this.orcamentoGenerator.getFormData();
        
        return {
            hasEmpresaData: !!data.empresa.nome,
            hasClienteData: !!data.cliente.nome,
            hasOrcamentoData: !!data.orcamento.numero,
            hasItems: data.items.length > 0,
            hasObservacoes: !!(data.observacoes.formaPagamento || data.observacoes.condicoes || data.observacoes.observacoes),
            totalValue: data.financeiro.total,
            itemsCount: data.items.length
        };
    }

    /**
     * Exporta dados do formulário
     */
    exportFormData() {
        try {
            const data = this.orcamentoGenerator.getFormData();
            const exportData = {
                ...data,
                exportedAt: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orcamento_${data.empresa.nome.replace(/\s+/g, '_')}_${data.orcamento.numero}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            return false;
        }
    }

    /**
     * Importa dados do formulário
     */
    importFormData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (this.loadFormData(data)) {
                        resolve(true);
                    } else {
                        reject(new Error('Erro ao carregar dados'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }
} 