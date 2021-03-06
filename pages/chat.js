import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { useRouter, withRouter } from 'next/router';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from "../src/components/ButtonSendSticker"

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ2NDE5OCwiZXhwIjoxOTU5MDQwMTk4fQ.4WAp8Z9_q6nActf4hKwPGzUVwLxO9mnEUgKfi8ReW9c';
const SUPABASE_URL = 'https://peibyntkmkajkbvmncka.supabase.co';

const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);


function escutaMsgEmTempoReal(adicionaMensagem) { 
    return supabaseClient
    .from('mensagens')
    .on('INSERT',(respostaLive)=>{
        adicionaMensagem(respostaLive.new);
    })
    .subscribe();
 }

export default function ChatPage() {
    // Sua lógica vai aqui
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([
       
    ]);
    React.useEffect(()=>{
        const dadosDoSubaBase = supabaseClient
            .from('mensagens')
            .select('*')
            .order('id',{ascending: false})
            .then(({data})=>{
                setListaDeMensagens(data)
            });

        escutaMsgEmTempoReal((novaMensagem)=>{
             setListaDeMensagens((valorAtual)=>{
                return[
                    novaMensagem,
                     ...valorAtual,
                ]
             })
        });
    },[]);

    // ./Sua lógica vai aqui
    const router = useRouter();
    const { username } = router.query;

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: listaDeMensagens.length + 1,
            de: username,
            texto: novaMensagem,
        }
        supabaseClient
        .from('mensagens')
        .insert([
            mensagem
        ])
         .then(({data})=>{
             console.log('craindo msg: '+ data)

        })
        
        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://exame.com/wp-content/uploads/2019/11/meditaccca7acc83o.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {/* Valor: {mensagem} */}
                    <MessageList mensagens={listaDeMensagens} />
                    {/* Lista de Mensgens: {listaDeMensagens.map((mensagemAtual)=>{
                        return(
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                                })} */} 
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ButtonSendSticker
                            onStickerClick={(sticker)=>{
                                handleNovaMensagem(':sticker:'+sticker)
                            }}
                        />
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key == 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button iconName = "arrowRight"
                            styleSheet = {
                                {
                                    backgroundColor: '#207227',
                                    hover: { backgroundColor: '#05400A' },
                                    focus: { backgroundColor: '#05400A' },
                                    top: '-0.4vw',
                                }
                            }
                            onClick = {
                                (event) => {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                        }/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    // console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')}/>
                        ):(
                            mensagem.texto
                        )}
                    </Text>
                )
            })}
        </Box>
    )
}