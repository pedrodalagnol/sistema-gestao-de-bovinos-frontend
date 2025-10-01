// DTO para a resposta da API (listar lotes)
export interface Lote {
    id: number;
    nome: string;
    descricao: string;
}

// DTO para a requisição (criar/editar um lote)
export interface LoteRequestDTO {
    nome: string;
    descricao: string;
}