# RB-037 – Netzwerkverbindung ungewöhnlich langsam (L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Fachstatus:** Recherchiert, **nicht praktisch validiert**. Die beiden Beispielszenarien und sämtliche Beispielmesswerte sind fiktiv.

## Paketinhalt – genau sechs Dateien

```text
RB-037_Netzwerkverbindung-ungewoehnlich-langsam/
├── README.md
├── RB-037_Lernartikel.md
├── RB-037_Praxis-Runbook.md
└── assets/
    ├── rb037_henne_ei_netzwerk_langsam.png
    ├── rb037_diagnosebaum.svg
    └── rb037_diagnosebaum_preview.png
```

| Datei | Nutzen |
|---|---|
| `RB-037_Lernartikel.md` | 15 Kapitel zu Messgrößen, Netzwerk- und Anwendungsdiagnose, TCP/IP, SMB, iPerf3, A/B-Tests, zwei fiktive Fälle und Active Recall |
| `RB-037_Praxis-Runbook.md` | Zehn Arbeitsabschnitte für L2, Sicherheitsgate, Befundmatrix, Retest und Beispiel-Ticketkommentar |
| `assets/rb037_henne_ei_netzwerk_langsam.png` | Henne-und-Ei-Infografik im professionelleren Projektstil |
| `assets/rb037_diagnosebaum.svg` | Skalierbarer technischer Diagnosebaum |
| `assets/rb037_diagnosebaum_preview.png` | Rastervorschau des Diagnosebaums |
| `README.md` | Struktur, Quellen, Prüfschritte und Veröffentlichungshinweise |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

## Diagnoseprinzip

**Nicht:** „Das Netzwerk ist langsam, also muss die Firewall defekt sein.“  
**Sondern:** Betroffenen Anwendungsvorgang und Baseline ermitteln → Testdimension auswählen → kontrolliert vergleichen → Ursache nachweisen → sichere Maßnahme → Retest unter Originalbedingungen.

**Besonderheit:** `LinkSpeed`, RTT, iperf3-Durchsatz und tatsächliche SMB-/Anwendungsreaktionszeit messen **verschiedene Dinge**. Auch eine technisch intakte Netzwerkverbindung kann eine langsame Anwendung nicht automatisch ausschließen.

## Sicherheit und Grenzen

- Alle aufgeführten Windows-PowerShell-Kommandos sind zur **lesenden** Befundaufnahme vorgesehen. Die iperf3-Kommandos erzeugen Testverkehr und sind nur nach Freigabe auszuführen.
- TEST-NET-IP-Adressen in Beispielen dienen ausschließlich der Illustration. Nie ungeprüft als reale Ziele verwenden.
- Keine Änderungen an NIC-Treibern, Duplex/Speed, Jumbo Frames/MTU, QoS, Firewall/VPN, SMB-Signierung oder Antimalware auf Verdacht.
- Keine Lasttests auf produktiven Uplinks ohne Auftrag, Messfenster und Limit; keine produktiven Dateien als Testdaten verwenden.
- Alle technischen Befunde müssen in der **späteren Laborvalidierung** nachgestellt und überprüft werden, bevor sie als praktisch bestätigt gelten.

## Offizielle Quellen (abgerufen/recherchiert 22.11.2026)

1. Microsoft: TCP/IP-Performance-Diagnose (Baseline, Durchsatz, TCP): https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/overview-of-tcpip-performance
2. Microsoft: Langsame SMB-Dateiübertragung (Storage, kleine Dateien, Sicherheitsmaßnahmen): https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/slow-smb-file-transfer
3. Microsoft: Paketverlust analysieren (NIC, Drops, Protokoll): https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/diagnose-packet-loss
4. Microsoft: `Get-NetAdapterStatistics`: https://learn.microsoft.com/en-us/powershell/module/netadapter/get-netadapterstatistics?view=windowsserver2025-ps
5. Microsoft: `Test-NetConnection`: https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2025-ps
6. ESnet: iperf3 Usage: https://software.es.net/iperf/invoking.html
7. Microsoft: Tuning von Netzwerkadaptern: https://learn.microsoft.com/de-de/windows-server/networking/technologies/network-subsystem/net-sub-performance-tuning-nics

## Training nach Abschluss der 50 Tickets

Erst eigene Hypothesen und Prüfpläne formulieren; im freigegebenen Labor kontrolliert messen, Störung reproduzieren und unabhängig diagnostizieren. Die recherchierten Runbooks dienen als **Prüfreferenz**, nicht als vorher vollständig einzusehendes Lösungsblatt. Active Recall und Spaced Repetition nach Bedarf; keine ungetestete Aussage als praktische Erfahrung deklarieren.

**Website:** Keine Änderungen am GitHub-Repository durchgeführt. Bereit für eine spätere, separate Veröffentlichung nach Freigabe.
