
$desktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$excelFile = Join-Path $desktopPath "Lista da Escola LKM 2026 (version 1).xlsb.xls"

Write-Output "Looking for file at: $excelFile"

if (-not (Test-Path $excelFile)) {
    Write-Output "Error: File not found at $excelFile"
    exit 1
}

$excel = New-Object -ComObject Excel.Application
try {
    $workbook = $excel.Workbooks.Open($excelFile)
    $sheetNames = @()
    foreach ($sh in $workbook.Sheets) { $sheetNames += $sh.Name }
    Write-Output "Sheets found: $($sheetNames.Count)"
    Write-Output "Sheet list: $($sheetNames -join ', ')"
    
    $sheet = $workbook.Sheets.Item(1)
    Write-Output "Inspecting Sheet: $($sheet.Name)"
    for ($r = 1; $r -le 15; $r++) {
        $vals = @()
        for ($c = 1; $c -le 8; $c++) {
            $v = $sheet.Cells.Item($r, $c).Text
            $vals += if ([string]::IsNullOrEmpty($v)) { "---" } else { $v.Trim() }
        }
        Write-Output ("Row $r >> " + ($vals -join " | "))
    }
    $workbook.Close($false)
}
catch {
    Write-Output "Error: $_"
}
finally {
    $excel.Quit()
}
