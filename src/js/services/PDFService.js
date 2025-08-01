/**
 * Serviço de PDF
 * Gerencia a geração e salvamento de PDFs
 */

export class PDFService {
    constructor(orcamentoGenerator) {
        this.orcamentoGenerator = orcamentoGenerator;
    }

    /**
     * Imprime orçamento
     */
    printOrcamento(data) {
        try {
            console.log('🖨️ Iniciando impressão...');
            
            const printContent = this.orcamentoGenerator.generateOrcamentoHTML(data);
            const printWindow = window.open('', '_blank');
            
            const fullHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Orçamento ${data.empresa.nome}</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                    <style>
                        ${this.getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            setTimeout(() => {
                                window.print();
                                setTimeout(() => {
                                    window.close();
                                }, 1000);
                            }, 500);
                        };
                    </script>
                </body>
                </html>
            `;
            
            printWindow.document.write(fullHTML);
            printWindow.document.close();
            
            this.orcamentoGenerator.notificationService.success('Impressão iniciada');
            
        } catch (error) {
            console.error('❌ Erro ao imprimir:', error);
            this.orcamentoGenerator.notificationService.error('Erro ao imprimir orçamento');
        }
    }

    /**
     * Salva como PDF
     */
    saveAsPDF(data) {
        try {
            console.log('💾 Salvando como PDF...');
            
            const printContent = this.orcamentoGenerator.generateOrcamentoHTML(data);
            const printWindow = window.open('', '_blank');
            
            const fullHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Orçamento ${data.empresa.nome}</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                    <style>
                        ${this.getPrintStyles()}
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            setTimeout(() => {
                                window.print();
                                setTimeout(() => {
                                    window.close();
                                }, 1000);
                            }, 500);
                        };
                    </script>
                </body>
                </html>
            `;
            
            printWindow.document.write(fullHTML);
            printWindow.document.close();
            
            // Salvar no localStorage
            this.orcamentoGenerator.storageService.saveOrcamento(data);
            
            // Fechar modal
            const modal = document.getElementById('previewModal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            this.orcamentoGenerator.notificationService.info('Abrindo impressora para salvar como PDF...');
            
        } catch (error) {
            console.error('❌ Erro ao salvar como PDF:', error);
            this.orcamentoGenerator.notificationService.error('Erro ao gerar PDF');
        }
    }

    /**
     * Obtém estilos para impressão
     */
    getPrintStyles() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #1a202c;
                background: white;
            }

            .orcamento-print {
                max-width: 800px;
                margin: 0 auto;
                padding: 30px;
            }

            .orcamento-header {
                border-bottom: 3px solid #1e293b;
                padding-bottom: 25px;
                margin-bottom: 30px;
            }

            .empresa-info {
                display: flex;
                align-items: flex-start;
                gap: 25px;
            }

            .empresa-logo-container {
                flex-shrink: 0;
            }

            .empresa-logo {
                width: 100px;
                height: 100px;
                object-fit: contain;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                padding: 12px;
                background: white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .empresa-logo-fallback {
                width: 100px;
                height: 100px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                padding: 12px;
                background: #3b82f6;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2.5rem;
            }

            .empresa-detalhes {
                flex: 1;
            }

            .empresa-detalhes h1 {
                font-size: 2rem;
                margin-bottom: 15px;
                color: #1e293b;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                line-height: 1.2;
            }

            .empresa-contato {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 0.9rem;
                color: #475569;
                line-height: 1.4;
            }

            .empresa-contato span {
                display: flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
            }

            .empresa-contato i {
                color: #3b82f6;
                width: 14px;
            }

            .documento-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                font-size: 0.95rem;
                background: #f8fafc;
                padding: 15px;
                border-radius: 10px;
                border: 1px solid #e2e8f0;
            }

            .doc-left h2 {
                font-size: 1.3rem;
                margin-bottom: 6px;
                color: #1e293b;
                font-weight: 700;
            }

            .doc-left p {
                margin-bottom: 4px;
                font-size: 0.9rem;
            }

            .doc-right p {
                margin-bottom: 4px;
                text-align: right;
                font-size: 0.9rem;
            }

            .cliente-info {
                margin-bottom: 30px;
            }

            .cliente-info h3 {
                border-bottom: 2px solid #1e293b;
                padding-bottom: 10px;
                margin-bottom: 15px;
                font-size: 1.3rem;
                color: #1e293b;
                font-weight: 600;
            }

            .cliente-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                font-size: 0.95rem;
            }

            .itens-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                font-size: 0.9rem;
            }

            .itens-table th,
            .itens-table td {
                border: 1px solid #e2e8f0;
                padding: 12px 8px;
                text-align: left;
                vertical-align: middle;
            }

            .itens-table th {
                background: #1e293b;
                color: white;
                font-weight: 600;
                text-align: center;
                font-size: 0.85rem;
                letter-spacing: 0.025em;
                padding: 15px 8px;
            }

            .itens-table td:nth-child(1) {
                text-align: center;
                font-weight: 600;
                color: #3b82f6;
                width: 50px;
            }

            .itens-table td:nth-child(2) {
                text-align: center;
                width: 60px;
            }

            .itens-table td:nth-child(3) {
                text-align: center;
                font-weight: 600;
                color: #3b82f6;
                width: 100px;
            }

            .itens-table td:nth-child(5),
            .itens-table td:nth-child(6) {
                text-align: right;
                width: 120px;
            }

            .itens-table tr:nth-child(even) {
                background: #f8fafc;
            }

            .resumo-financeiro {
                margin-bottom: 30px;
                background: #f8fafc;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #e2e8f0;
            }

            .resumo-financeiro h3 {
                margin-bottom: 15px;
                font-size: 1.3rem;
                color: #1e293b;
                font-weight: 600;
            }

            .resumo-item {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e2e8f0;
                font-size: 0.95rem;
            }

            .resumo-item:last-child {
                border-bottom: none;
            }

            .resumo-item.total {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1a202c;
                border-top: 2px solid #3b82f6;
                margin-top: 12px;
                padding-top: 20px;
            }

            .observacoes {
                margin-bottom: 30px;
            }

            .observacoes h3 {
                border-bottom: 2px solid #1e293b;
                padding-bottom: 10px;
                margin-bottom: 15px;
                font-size: 1.3rem;
                color: #1e293b;
                font-weight: 600;
            }

            .obs-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                font-size: 0.95rem;
            }

            .obs-grid div {
                padding: 10px;
                background: #f8fafc;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }

            .assinaturas {
                display: flex;
                justify-content: space-between;
                margin-top: 40px;
                gap: 40px;
            }

            .assinatura {
                text-align: center;
                flex: 1;
            }

            .assinatura-line {
                border-bottom: 2px solid #1e293b;
                margin-bottom: 12px;
                height: 50px;
            }

            .assinatura p {
                font-weight: 600;
                color: #1e293b;
                font-size: 0.95rem;
                margin: 0;
            }

            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
                
                .orcamento-print {
                    max-width: none;
                    margin: 0;
                    padding: 20px;
                }
                
                .empresa-logo,
                .empresa-logo-fallback {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
                
                .itens-table th {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
                
                .resumo-financeiro {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
            }
        `;
    }

    /**
     * Gera nome do arquivo PDF
     */
    generateFileName(data) {
        const empresa = data.empresa.nome.replace(/\s+/g, '_');
        const numero = data.orcamento.numero;
        const dataStr = new Date().toISOString().split('T')[0];
        return `Orcamento_${empresa}_${numero}_${dataStr}.pdf`;
    }

    /**
     * Verifica se o navegador suporta impressão
     */
    isPrintSupported() {
        return typeof window.print === 'function';
    }

    /**
     * Obtém informações do navegador
     */
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }
} 