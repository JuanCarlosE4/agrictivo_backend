class ResponseApi {
    structure = {
        status: 'success',
        message: '',
        code: 200,
        results: null,
    }
    constructor() {
    }
    setStatus = (codigo, estado, mensaje) => {
        this.structure.code = codigo;
        this.structure.status = estado;
        this.structure.message = mensaje;
    }
    setResult = (ressult) => {
        this.structure.results = ressult
    }

    toResponse = () => {
        return {
            status: this.structure.status,
            message: this.structure.message,
            code: this.structure.code,
            results: this.structure.results,
        }
    }
}
export default ResponseApi