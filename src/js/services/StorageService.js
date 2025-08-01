/**
 * Serviço de Armazenamento
 * Gerencia o armazenamento local dos dados da aplicação
 */

export class StorageService {
    constructor() {
        this.storageKey = 'orcamentoData';
        this.lastNumberKey = 'lastOrcamentoNumber';
        this.historyKey = 'orcamentoHistory';
    }

    /**
     * Salva os dados do orçamento
     * @param {Object} data - Dados do orçamento
     */
    saveOrcamento(data) {
        try {
            // Salvar dados atuais
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            
            // Salvar número do último orçamento
            localStorage.setItem(this.lastNumberKey, data.orcamento.numero);
            
            // Adicionar ao histórico
            this.addToHistory(data);
            
            console.log('✅ Dados salvos no localStorage');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Carrega os dados do orçamento
     * @returns {Object|null} Dados do orçamento ou null
     */
    loadOrcamento() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    /**
     * Obtém o próximo número de orçamento
     * @returns {number} Próximo número
     */
    getNextOrcamentoNumber() {
        try {
            const lastNumber = parseInt(localStorage.getItem(this.lastNumberKey)) || 0;
            return lastNumber + 1;
        } catch (error) {
            console.error('❌ Erro ao obter número do orçamento:', error);
            return 1;
        }
    }

    /**
     * Adiciona orçamento ao histórico
     * @param {Object} data - Dados do orçamento
     */
    addToHistory(data) {
        try {
            const history = this.getHistory();
            
            const orcamentoEntry = {
                id: Date.now(),
                numero: data.orcamento.numero,
                empresa: data.empresa.nome,
                cliente: data.cliente.nome,
                data: data.orcamento.data,
                total: data.financeiro.total,
                createdAt: new Date().toISOString(),
                data: data
            };
            
            // Adicionar no início do array
            history.unshift(orcamentoEntry);
            
            // Manter apenas os últimos 50 orçamentos
            if (history.length > 50) {
                history.splice(50);
            }
            
            localStorage.setItem(this.historyKey, JSON.stringify(history));
        } catch (error) {
            console.error('❌ Erro ao adicionar ao histórico:', error);
        }
    }

    /**
     * Obtém o histórico de orçamentos
     * @returns {Array} Lista de orçamentos
     */
    getHistory() {
        try {
            const history = localStorage.getItem(this.historyKey);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('❌ Erro ao carregar histórico:', error);
            return [];
        }
    }

    /**
     * Carrega um orçamento específico do histórico
     * @param {number} id - ID do orçamento
     * @returns {Object|null} Dados do orçamento ou null
     */
    loadFromHistory(id) {
        try {
            const history = this.getHistory();
            const orcamento = history.find(item => item.id === id);
            return orcamento ? orcamento.data : null;
        } catch (error) {
            console.error('❌ Erro ao carregar do histórico:', error);
            return null;
        }
    }

    /**
     * Remove um orçamento do histórico
     * @param {number} id - ID do orçamento
     */
    removeFromHistory(id) {
        try {
            const history = this.getHistory();
            const filteredHistory = history.filter(item => item.id !== id);
            localStorage.setItem(this.historyKey, JSON.stringify(filteredHistory));
            return true;
        } catch (error) {
            console.error('❌ Erro ao remover do histórico:', error);
            return false;
        }
    }

    /**
     * Limpa todos os dados
     */
    clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.lastNumberKey);
            localStorage.removeItem(this.historyKey);
            console.log('✅ Todos os dados foram removidos');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar dados:', error);
            return false;
        }
    }

    /**
     * Exporta todos os dados
     * @returns {Object} Dados exportados
     */
    exportData() {
        try {
            return {
                current: this.loadOrcamento(),
                lastNumber: localStorage.getItem(this.lastNumberKey),
                history: this.getHistory(),
                exportedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            return null;
        }
    }

    /**
     * Importa dados
     * @param {Object} data - Dados para importar
     */
    importData(data) {
        try {
            if (data.current) {
                localStorage.setItem(this.storageKey, JSON.stringify(data.current));
            }
            
            if (data.lastNumber) {
                localStorage.setItem(this.lastNumberKey, data.lastNumber);
            }
            
            if (data.history) {
                localStorage.setItem(this.historyKey, JSON.stringify(data.history));
            }
            
            console.log('✅ Dados importados com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao importar dados:', error);
            return false;
        }
    }

    /**
     * Verifica se o localStorage está disponível
     * @returns {boolean} True se disponível
     */
    isAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém estatísticas do armazenamento
     * @returns {Object} Estatísticas
     */
    getStats() {
        try {
            const history = this.getHistory();
            const current = this.loadOrcamento();
            
            return {
                totalOrcamentos: history.length,
                lastOrcamento: history[0] || null,
                hasCurrentData: !!current,
                storageSize: this.getStorageSize(),
                lastUpdate: history[0]?.createdAt || null
            };
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas:', error);
            return null;
        }
    }

    /**
     * Calcula o tamanho do armazenamento
     * @returns {string} Tamanho em bytes
     */
    getStorageSize() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return this.formatBytes(total);
        } catch (error) {
            return '0 B';
        }
    }

    /**
     * Formata bytes para formato legível
     * @param {number} bytes - Bytes para formatar
     * @returns {string} String formatada
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
} 