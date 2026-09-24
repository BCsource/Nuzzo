//func apenas para mostrar no ui o alert da mensagem de erro. todos os erros sao sempre respondidos e tratados do lado do be

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again later.') {
    return error?.response?.data?.message || fallback;
}