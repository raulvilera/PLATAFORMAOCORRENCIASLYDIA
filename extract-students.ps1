
$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$excelFile = Join-Path $desktopPath "Lista da Escola LKM 2026 (version 1).xlsb.xls"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$outputFile = Join-Path $scriptPath "students_full_export.json"

Write-Host "Arquivo alvo: $excelFile"

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $workbook = $excel.Workbooks.Open($excelFile)
}
catch {
    Write-Error "Falha ao abrir o Excel: $_"
    $excel.Quit()
    exit 1
}

$allStudents = @()

foreach ($sheet in $workbook.Sheets) {
    $sheetName = $sheet.Name
    if ($sheetName -match "Sheet" -or $sheetName -match "Planilha") { continue }
    
    Write-Host "Processando turma: $sheetName"
    
    $row = 1
    # Pula cabeçalhos: procura pelo primeiro nome completo
    for ($r = 1; $r -le 10; $r++) {
        $cellVal = $sheet.Cells.Item($r, 2).Text
        if ($cellVal -ne $null -and $cellVal.Trim().Length -gt 5 -and $cellVal -notmatch "NOME|ALUNO") {
            $row = $r
            break
        }
    }

    # Extrai até encontrar 5 linhas vazias seguidas ou atingir o limite
    $emptyCount = 0
    while ($emptyCount -lt 5 -and $row -le 100) {
        $nome = $sheet.Cells.Item($row, 2).Text
        $ra = $sheet.Cells.Item($row, 3).Text
        
        if ([string]::IsNullOrWhiteSpace($nome)) {
            $emptyCount++
            $row++
            continue
        }
        
        $emptyCount = 0
        $nome = $nome.Trim().ToUpper()
        $ra = $ra.Trim().ToLower()
        
        if ($nome.Length -gt 3) {
            $allStudents += @{
                nome  = $nome
                ra    = $ra
                turma = $sheetName
            }
        }
        
        $row++
    }
}

$allStudents | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding utf8

$workbook.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

Write-Host "Extração concluída! Total de alunos: $($allStudents.Count)"
Write-Host "Dados salvos em: $outputFile"
