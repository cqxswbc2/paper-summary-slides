param([string]$Deck, [string]$OutDir, [int]$Width = 1400, [int]$Height = 788)
# Exports every slide of $Deck to $OutDir\slide-NN.png using PowerPoint itself (true rendering).
New-Item -ItemType Directory -Force $OutDir | Out-Null
Get-ChildItem $OutDir -Filter "slide-*.png" | Remove-Item -Force
$app = New-Object -ComObject PowerPoint.Application
try {
  $p = $app.Presentations.Open($Deck, $true, $false, $false)
  $i = 1
  foreach ($s in $p.Slides) {
    $s.Export((Join-Path $OutDir ("slide-{0:D2}.png" -f $i)), "PNG", $Width, $Height)
    $i++
  }
  $p.Close()
  "exported $($i - 1) slides"
} finally {
  $app.Quit()
}
