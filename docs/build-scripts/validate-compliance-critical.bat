@echo off
echo.
echo ========================================
echo 🔍 VALIDAÇÃO COMPLIANCE CRÍTICO
echo ========================================
echo.

echo 📋 Verificando 5 pontos críticos de compliance...
echo.

set /a total_points=5
set /a passed_points=0

:: ===== PONTO 1: VERIFICAÇÃO DE IDADE OBRIGATÓRIA =====
echo 🔞 1. VERIFICAÇÃO DE IDADE OBRIGATÓRIA
echo ----------------------------------------

set /a age_verification_score=0

:: Verificar se componente existe
if exist "components\age-verification.tsx" (
    echo ✅ Componente AgeVerificationModal existe
    set /a age_verification_score+=1
) else (
    echo ❌ Componente AgeVerificationModal não encontrado
)

:: Verificar se está sendo usado no layout
findstr "AgeVerificationWrapper" "app\layout.tsx" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ AgeVerificationWrapper configurado no layout principal
    set /a age_verification_score+=1
) else (
    echo ❌ AgeVerificationWrapper não configurado no layout
)

:: Verificar funcionalidades obrigatórias no componente
if exist "components\age-verification.tsx" (
    findstr "13 anos ou mais" "components\age-verification.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Limite mínimo de 13 anos implementado
        set /a age_verification_score+=1
    ) else (
        echo ❌ Limite mínimo de 13 anos não encontrado
    )
    
    findstr "localStorage" "components\age-verification.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Persistência da verificação implementada
        set /a age_verification_score+=1
    ) else (
        echo ❌ Persistência da verificação não implementada
    )
    
    findstr "validateAge" "components\age-verification.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Validação de idade funcional
        set /a age_verification_score+=1
    ) else (
        echo ❌ Validação de idade não implementada
    )
)

if %age_verification_score% geq 4 (
    echo ✅ PONTO 1: APROVADO - Verificação de idade obrigatória implementada
    set /a passed_points+=1
) else (
    echo ❌ PONTO 1: REPROVADO - Verificação de idade insuficiente
)

echo Score: %age_verification_score%/5
echo.

:: ===== PONTO 2: TERMOS DE USO COMPLETOS =====
echo 📋 2. TERMOS DE USO COMPLETOS
echo ----------------------------------------

set /a terms_score=0

:: Verificar se página existe
if exist "app\terms-of-use\page.tsx" (
    echo ✅ Página de Termos de Uso existe
    set /a terms_score+=1
) else (
    echo ❌ Página de Termos de Uso não encontrada
)

if exist "app\terms-of-use\page.tsx" (
    :: Verificar seções obrigatórias
    findstr "Elegibilidade e Verificação de Idade" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Seção de elegibilidade e verificação de idade presente
        set /a terms_score+=1
    ) else (
        echo ❌ Seção de elegibilidade não encontrada
    )
    
    findstr "Proteção de Menores" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Seção de proteção de menores presente
        set /a terms_score+=1
    ) else (
        echo ❌ Seção de proteção de menores não encontrada
    )
    
    findstr "Remoção de Conteúdo" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Seção de remoção de conteúdo presente
        set /a terms_score+=1
    ) else (
        echo ❌ Seção de remoção de conteúdo não encontrada
    )
    
    findstr "app-uca@mandara.com.br" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Email de contato para remoção especificado
        set /a terms_score+=1
    ) else (
        echo ❌ Email de contato não encontrado
    )
)

if %terms_score% geq 4 (
    echo ✅ PONTO 2: APROVADO - Termos de Uso completos e estruturados
    set /a passed_points+=1
) else (
    echo ❌ PONTO 2: REPROVADO - Termos de Uso incompletos
)

echo Score: %terms_score%/5
echo.

:: ===== PONTO 3: SEÇÃO DE PROTEÇÃO DE MENORES =====
echo 👶 3. SEÇÃO DE PROTEÇÃO DE MENORES
echo ----------------------------------------

set /a protection_score=0

:: Verificar nos Termos de Uso
if exist "app\terms-of-use\page.tsx" (
    findstr "menores de 13 anos" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Proteção específica para menores de 13 anos
        set /a protection_score+=1
    ) else (
        echo ❌ Proteção para menores de 13 anos não especificada
    )
    
    findstr "supervisão parental" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Recomendação de supervisão parental presente
        set /a protection_score+=1
    ) else (
        echo ❌ Supervisão parental não mencionada
    )
    
    findstr "Conteúdo Apropriado" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Garantia de conteúdo apropriado para todas as idades
        set /a protection_score+=1
    ) else (
        echo ❌ Conteúdo apropriado não garantido
    )
)

:: Verificar na Política de Privacidade
if exist "app\privacy-policy\page.tsx" (
    findstr "Proteção de Menores" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Seção específica de proteção de menores na política
        set /a protection_score+=1
    ) else (
        echo ❌ Seção de proteção de menores não encontrada na política
    )
    
    findstr "dados pessoais de usuários menores" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Política específica sobre dados de menores
        set /a protection_score+=1
    ) else (
        echo ❌ Política sobre dados de menores não especificada
    )
)

if %protection_score% geq 4 (
    echo ✅ PONTO 3: APROVADO - Proteção de menores adequadamente implementada
    set /a passed_points+=1
) else (
    echo ❌ PONTO 3: REPROVADO - Proteção de menores insuficiente
)

echo Score: %protection_score%/5
echo.

:: ===== PONTO 4: AVISO SOBRE CONTEÚDO DE FONTES ABERTAS =====
echo 📚 4. AVISO SOBRE CONTEÚDO DE FONTES ABERTAS
echo ----------------------------------------

set /a content_score=0

:: Verificar nos Termos de Uso
if exist "app\terms-of-use\page.tsx" (
    findstr "fontes abertas" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Menção a fontes abertas nos Termos de Uso
        set /a content_score+=1
    ) else (
        echo ❌ Fontes abertas não mencionadas nos Termos
    )
    
    findstr "domínio público" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Referência a conteúdo de domínio público
        set /a content_score+=1
    ) else (
        echo ❌ Domínio público não mencionado
    )
    
    findstr "fins educacionais" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Clarificação sobre uso educacional
        set /a content_score+=1
    ) else (
        echo ❌ Uso educacional não clarificado
    )
)

:: Verificar na Política de Privacidade
if exist "app\privacy-policy\page.tsx" (
    findstr "Fontes Abertas" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Seção específica sobre fontes abertas na política
        set /a content_score+=1
    ) else (
        echo ❌ Fontes abertas não mencionadas na política
    )
    
    findstr "Transparência sobre Conteúdo" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Transparência sobre origem do conteúdo
        set /a content_score+=1
    ) else (
        echo ❌ Transparência sobre conteúdo não especificada
    )
)

if %content_score% geq 4 (
    echo ✅ PONTO 4: APROVADO - Aviso sobre fontes abertas adequado
    set /a passed_points+=1
) else (
    echo ❌ PONTO 4: REPROVADO - Aviso sobre fontes abertas insuficiente
)

echo Score: %content_score%/5
echo.

:: ===== PONTO 5: CLARIFICAÇÃO DO EMAIL PARA REMOÇÃO =====
echo 📧 5. EMAIL PARA REMOÇÃO DE CONTEÚDO
echo ----------------------------------------

set /a email_score=0

:: Verificar nos Termos de Uso
if exist "app\terms-of-use\page.tsx" (
    findstr "app-uca@mandara.com.br" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Email de contato presente nos Termos de Uso
        set /a email_score+=1
    ) else (
        echo ❌ Email não encontrado nos Termos de Uso
    )
    
    findstr "48 horas" "app\terms-of-use\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Tempo de resposta especificado nos Termos
        set /a email_score+=1
    ) else (
        echo ❌ Tempo de resposta não especificado nos Termos
    )
)

:: Verificar na Política de Privacidade
if exist "app\privacy-policy\page.tsx" (
    findstr "app-uca@mandara.com.br" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Email de contato presente na Política de Privacidade
        set /a email_score+=1
    ) else (
        echo ❌ Email não encontrado na Política de Privacidade
    )
    
    findstr "Solicitação de Remoção" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Processo de remoção claramente descrito
        set /a email_score+=1
    ) else (
        echo ❌ Processo de remoção não descrito
    )
    
    findstr "Remoção de Conteúdo.*processadas prioritariamente" "app\privacy-policy\page.tsx" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ Prioridade para remoção de conteúdo especificada
        set /a email_score+=1
    ) else (
        echo ❌ Prioridade para remoção não especificada
    )
)

if %email_score% geq 4 (
    echo ✅ PONTO 5: APROVADO - Email e processo de remoção clarificados
    set /a passed_points+=1
) else (
    echo ❌ PONTO 5: REPROVADO - Email ou processo de remoção insuficiente
)

echo Score: %email_score%/5
echo.

:: ===== RESULTADO FINAL =====
set /a percentage=(%passed_points% * 100) / %total_points%

echo ========================================
echo 📊 RESULTADO FINAL - COMPLIANCE CRÍTICO
echo ========================================
echo.
echo ✅ Pontos Aprovados: %passed_points%/%total_points%
echo 📈 Score de Compliance: %percentage%%%
echo.

if %percentage% equ 100 (
    echo 🎉 EXCELENTE! Todos os pontos críticos estão OK
    echo 💡 Status: PRONTO PARA SUBMISSÃO ÀS STORES
    echo.
    echo ✅ Verificação de idade obrigatória: IMPLEMENTADA
    echo ✅ Termos de Uso completos: IMPLEMENTADOS
    echo ✅ Proteção de menores: IMPLEMENTADA
    echo ✅ Aviso sobre fontes abertas: IMPLEMENTADO
    echo ✅ Email para remoção: CLARIFICADO
) else if %percentage% geq 80 (
    echo ✅ BOM! Maioria dos pontos críticos está OK
    echo 💡 Status: QUASE PRONTO - Pequenos ajustes necessários
) else if %percentage% geq 60 (
    echo ⚠️  ATENÇÃO! Alguns pontos críticos precisam de atenção
    echo 💡 Status: NECESSÁRIOS AJUSTES IMPORTANTES
) else (
    echo ❌ CRÍTICO! Vários pontos obrigatórios não estão OK
    echo 💡 Status: IMPLEMENTAÇÃO NECESSÁRIA ANTES DA SUBMISSÃO
)

echo.
echo 📋 DETALHAMENTO:
echo    🔞 Verificação de idade: Score %age_verification_score%/5
echo    📋 Termos de Uso: Score %terms_score%/5
echo    👶 Proteção de menores: Score %protection_score%/5
echo    📚 Conteúdo fontes abertas: Score %content_score%/5
echo    📧 Email para remoção: Score %email_score%/5

echo.
echo ⚠️  IMPORTÂNCIA DESTES PONTOS:
echo    - São OBRIGATÓRIOS para Google Play Store
echo    - CRÍTICOS para compliance COPPA (proteção de menores)
echo    - NECESSÁRIOS para evitar rejeição automática
echo    - EXIGIDOS por políticas de app stores

if %percentage% neq 100 (
    echo.
    echo 🛠️  PRÓXIMOS PASSOS:
    if %age_verification_score% lss 4 (
        echo    1. Corrigir implementação da verificação de idade
    )
    if %terms_score% lss 4 (
        echo    2. Completar Termos de Uso com seções obrigatórias
    )
    if %protection_score% lss 4 (
        echo    3. Melhorar seções de proteção de menores
    )
    if %content_score% lss 4 (
        echo    4. Adicionar avisos sobre conteúdo de fontes abertas
    )
    if %email_score% lss 4 (
        echo    5. Clarificar processo de remoção de conteúdo
    )
)

echo.
pause
