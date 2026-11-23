# RB-038 – Bestimmter Server nicht erreichbar (L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Fachstatus:** Recherchiert; **nicht praktisch validiert**. Alle Beispielserver, Test-Adressen, Befunde und Fallverläufe sind fiktiv.

## Inhalt des Komplettpakets: genau sechs Dateien

```text
RB-038_Server-nicht-erreichbar/
├── README.md
├── RB-038_Lernartikel.md
├── RB-038_Praxis-Runbook.md
└── assets/
    ├── rb038_henne_ei_server_erreichbarkeit.png
    ├── rb038_diagnosebaum.svg
    └── rb038_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-038_Lernartikel.md` | 15 Kapitel zu DNS, Netzwerkpfad, IPv4/IPv6, Firewall, Serverstatus, TCP-Tests, zwei fiktiven Fällen und Active Recall |
| `RB-038_Praxis-Runbook.md` | Zehn Abschnitte für L1/L2, Sicherheitsgate, A/B-Tests, Eskalation, Retest und Muster-Ticketnotiz |
| `assets/rb038_henne_ei_server_erreichbarkeit.png` | Henne-und-Ei-Infografik in professionellerem Projektstil |
| `assets/rb038_diagnosebaum.svg` | Technischer, skalierbarer Diagnose-Entscheidungsbaum |
| `assets/rb038_diagnosebaum_preview.png` | PNG-Vorschau des Entscheidungsbaums |
| `README.md` | Dateistruktur, Status, Quellen und Veröffentlichungshinweise |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

## Kernprinzip

**Nicht:** „Ping funktioniert nicht, also ist der Server aus.“  
**Sondern:** Fehlermeldung + Reichweite erfassen → DNS und tatsächliche IP prüfen → Quell-IP/VPN/Route → TCP-Zielport → Vergleichsclient → Server-/Dienstzustand → minimale freigegebene Maßnahme → echter Anwendungstest.

**Unterscheidung zu RB-039:** Dieses Ticket untersucht das End-to-End-Erreichbarkeitsproblem; RB-039 vertieft den einzelnen Dienst-/TCP-Portfehler.

## Sicherheitsregeln

- Die Befehle im Runbook sind **lesende** Diagnosen oder senden nur wenige Testanfragen; sie ändern keine Firewall, Route oder Serverkonfiguration.
- Bei einem einzigen Remotezugang keine Netzwerkkonfiguration verändern, die den Rückweg unterbricht.
- Kein Abschalten von Firewalls/EDR, keine beliebige Portfreigabe und kein Serverneustart zur „Probe“.
- Beispieladressen `192.0.2.40` und Namen unter `.example` sind bewusst als **nicht produktive Dokumentationsziele** gewählt.
- TCP-Erreichbarkeit, ICMP-Erreichbarkeit und Anwendungsverfügbarkeit sind **verschiedene Nachweise**.
- Für Mitschnitte, Log-Zugriff und produktive Änderungen gelten Freigaben sowie Datenschutz- und Informationssicherheitsregeln.

## Offizielle Quellen (recherchiert am 22.11.2026)

1. Microsoft: Windows Server TCP/IP-Kommunikationsdiagnose: https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-tcp-ip-communication-guidance
2. Microsoft: `Test-NetConnection` (PowerShell): https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2025-ps
3. Microsoft: Windows-Client TCP/IP-Verbindungsdiagnose: https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/tcp-ip-connectivity-issues-troubleshooting
4. Microsoft: TRACERT im Troubleshooting: https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/trace-route-troubleshoot-tcp-ip-problems
5. Microsoft: DNS-Client-Namensauflösung: https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/troubleshoot-dns-client-resolution-issues

## Trainings- und Veröffentlichungsablauf

**Laborvalidierung:** Erstelle zunächst ohne Kenntnis der Musterlösung eigene Hypothesen; simuliere einen Defekt an einem isolierten Testziel (z. B. DNS auf alte IP oder explizite Test-ACL). Dokumentiere Vorher/Nachher, sichere Logs und überprüfe Anwendung sowie Benutzerzugriff. **Nur tatsächlich ausgeführte Schritte als praktisch validiert kennzeichnen.**

**Website:** Keine Repository-Dateien geändert. Dieses Archiv ist eine vorbereitete Arbeitsgrundlage für spätere Qualitätsprüfung und Veröffentlichung.
