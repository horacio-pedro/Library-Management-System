module.exports = {
    users: {
        create: {
            name: {
                required: true,
                message: 'O campo nome não pode ser vasio'
            },
            email: {
                required: true,
                type: 'email',
                message: 'Eamil inválido'
            },
            phone: {
                required: true,
                len: 9,
                message: 'Número inválido'
            },
            password: {
                required: true,
                min: 4,
                message: 'Palavra-passe inválida'
            },
            address: {
                required: true,
                message: 'Endereço inválido'
            },
            gender: {
                required: true,
                message: 'Escolha um género'
            },
            nip: {
                required: true,
                message: 'Introduza o seu NIP'
            },
            patent: {
                required: true,
                min: 4,
                message: 'Patente inválida, escreva correctamente'
            }
        },
        update: {
            name: {
                required: true,
                message: 'O nome não pode ser vasio'
            },
            email: {
                required: true,
                type: 'email',
                message: 'email inválido'
            },
            phone: {
                required: true,
                len: 11,
                message: 'Número inválido'
            },
            address: {
                required: true,
                message: 'endereço Inválido'
            },
            gender: {
                required: true,
                message: 'Seleccione o seu género'
            },
            nip: {
                required: true,
                message: 'Introduza o seu NIP'
            },
            patent: {
                required: true,
                min: 4,
                message: 'Patente inválida, escreva correctamente'
            }
        },
        login: {
            email: {
                required: true,
                type: 'email',
                message: 'Email inválido'
            },
            password: {
                required: true,
                message: 'Palavra-passe inválida'
            }
        },
        changePassword: {
            oldPassword: {
                required: true,
                min: 4,
                message: 'Antiga alavra-passe inválida'
            },
            newPassword: {
                required: true,
                min: 4,
                message: 'Nova alavra-passe inválida'
            },
            confirmPassword: {
                required: true,
                min: 4,
                message: 'Nova alavra-passe de confimação inválida'
            }
        }
    },

    books: {
        create: {
            genre: {
                required: true,
                message: 'Genre cannot be empty'
            },
            title: {
                required: true,
                message: 'Title cannot be empty'
            },
            publisher: {
                required: true,
                message: 'Publisher cannot be empty'
            },
            author: {
                required: true,
                message: 'Author cannot be empty'
            },
            edition: {
                required: true,
                message: 'Invalid Edition'
            },
            isbn: {
                required: true,
                message: 'ISBN cannot be empty'
            },
            pages: {
                required: true,
                message: 'Invalid Pages'
            }
        },
        request: {
            genre: {
                required: true,
                message: 'Genre cannot be empty'
            },
            title: {
                required: true,
                message: 'Title cannot be empty'
            },
            author: {
                required: true,
                message: 'Author cannot be empty'
            },
            edition: {
                required: true,
                message: 'Invalid Edition'
            },
            isbn: {
                required: true,
                message: 'ISBN cannot be empty'
            }
        }
    },

    eBooks: {
        create: {
            genre: {
                required: true,
                message: 'Genre cannot be empty'
            },
            title: {
                required: true,
                message: 'Title cannot be empty'
            },
            publisher: {
                required: true,
                message: 'Publisher cannot be empty'
            },
            author: {
                required: true,
                message: 'Author cannot be empty'
            },
            edition: {
                required: true,
                message: 'Invalid Edition'
            },
            isbn: {
                required: true,
                message: 'ISBN cannot be empty'
            },
            pages: {
                required: true,
                message: 'Invalid Pages'
            },
            fil: {
                required: true,
                message: 'Ficheiro inválido'
            }
        }
    }
};
