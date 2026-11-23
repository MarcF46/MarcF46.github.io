# RB-035 – Client erhält keine DHCP-Adresse (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Microsoft-/Herstellerdokumentation recherchiert; **praktische Laborvalidierung ausstehend**.

## Komplettpaket – sechs Dateien

```text
RB-035_Client-erhaelt-keine-DHCP-Adresse/
├── README.md
├── RB-035_Lernartikel.md
├── RB-035_Praxis-Runbook.md
└── assets/
    ├── rb035_henne_ei_dhcp.png
    ├── rb035_diagnosebaum.svg
    └── rb035_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-035_Lernartikel.md` | 15 Kapitel, DHCP-DORA, Client/Link/Relay/Scope, sichere PowerShell-Diagnose, zwei fiktive Musterfälle, Active Recall und Microsoft-Quellen |
| `RB-035_Praxis-Runbook.md` | 10 Abschnitte, L1/L2-Ticketbearbeitung, Mess- und Entscheidungsmatrix, Sicherheitsgate, Retest und Ticketkommentar |
| `assets/rb035_henne_ei_dhcp.png` | Professionelle Henne-und-Ei-DHCP-Infografik mit fünf Phasen |
| `assets/rb035_diagnosebaum.svg` | Skalierbarer technischer DHCP-Diagnosebaum mit Paketfluss-Verzweigungen |
| `assets/rb035_diagnosebaum_preview.png` | PNG-Vorschau zur späteren GitHub-Pages-Veröffentlichung |
| `README.md` | Struktur, Kerngedanke, Lernziel, Quellen und Sicherheitsgrenzen |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

## Kerngedanke

**Ohne IP-Adresse ist nicht automatisch der DHCP-Server schuld.** Kontrollierte Reihenfolge:

**Fehlerbild/Betroffenheit → Adapter/Link/VLAN → Discover/Offer/Request/ACK → Relay/Server/Scope/Policy → begründete Korrektur → gültiger Lease + echter Anwendungstest**.

Drei zentrale Prüfdifferenzen:

1. **DORA vs. Lease-Verlängerung:** `ipconfig /renew` zeigt nicht unter allen Bedingungen den vollständigen DORA-Neubezug.
2. **Link vs. DHCP:** Ein aktiver WLAN- oder Ethernet-Link beweist keine erfolgreiche DHCP-Adressvergabe.
3. **Lease vs. Funktion:** Eine erhaltene IP-Adresse beweist weder korrekte DNS-/Gateway-Optionen noch erfolgreiche Anwendungszugriffe.

## Sicherheit und Zuständigkeit

- `ipconfig /release`, `ipconfig /renew` und das Umstecken von Netzwerkanschlüssen können aktiv in den Netzwerkzustand eingreifen; nie ungefragt über den einzigen Fernzugang.
- Nur freigegebene Testports und Geräte; MAC-Adressen und interne Infrastruktur nicht öffentlich dokumentieren.
- DHCP-Scope, Reservierungen, AD-Autorisierung, Firewall, VLAN, Relay, NAC und Snooping sind **Change-pflichtige Administrationsaufgaben**.
- `Get-DhcpServer*` setzt DHCP-Server/RSAT und passende Berechtigungen voraus; Cmdlet-Unterstützung und Versionen im Zielsystem prüfen.
- IP-Beispiele `192.168.120.0/24` und `dhcp01.corp.example` sind fiktive Lernwerte.
- Das ZIP ist **dateitechnisch geprüft**, aber **kein praktischer Beweis**, dass jede Diagnose in einer realen Umgebung erfolgreich ausgeführt wurde.

## Praktisches Lerntraining nach Abschluss aller 50 Tickets

1. Fiktive Störungsmeldung ohne Lösungsweg bekommen, drei Hypothesen selbst formulieren.
2. Lesende Windows-Diagnose durchführen, Ergebnisse als Hypothese → Test → Befund notieren.
3. In isoliertem Lab einen nicht erreichbaren DHCP-Relay- oder falsch eingestellten Clientfall nachstellen (keine Änderungen in Produktivnetzen).
4. Eigenes Runbook mit A/B-Vergleich, Messungen, Sicherheitsgate, Entscheidung und Retest formulieren.
5. Erst dann gegen diesen recherchierten Lernartikel und das Runbook vergleichen.
6. Nach ca. 7 und 21 Tagen ein anderes Fehlerbild ohne Hinweise diagnostizieren.

## Herstellerquellen – Microsoft Learn (Recherche: 22.11.2026)

- [Q1] https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-dhcp-guidance
- [Q2] https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue
- [Q3] https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-problems-dhcp-client
- [Q4] https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/ipconfig
- [Q5] https://learn.microsoft.com/de-de/windows-server/troubleshoot/how-to-use-automatic-tcpip-addressing-without-a-dh
- [Q6] https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4scopestatistics?view=windowsserver2025-ps
- [Q7] https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshooting-guide-dhcp-authorization-failures
- [Q8] https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4binding?view=windowsserver2025-ps
- [Q9] https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4scope?view=windowsserver2025-ps
- [Q10] https://learn.microsoft.com/en-us/powershell/module/dhcpserver/get-dhcpserverv4lease?view=windowsserver2025-ps
- [Q11] https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/event-4199-windows-client-cannot-get-ip-address-dhcp-server

**Transparenz:** Keine realen Supportfälle bearbeitet, keine Labortests durchgeführt, keine Änderungen an deiner Website vorgenommen.
