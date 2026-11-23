# RB-036 – APIPA-Adresse 169.254.x.x (L1/L2)

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Datum:** 22.11.2026 · **Version:** 1.0  
**Fachstatus:** Offizielle Microsoft-/IETF-Quellen recherchiert; **praktische Validierung ausstehend**.

## Paketinhalt – genau sechs Dateien

```text
RB-036_APIPA-Adresse-169-254/
├── README.md
├── RB-036_Lernartikel.md
├── RB-036_Praxis-Runbook.md
└── assets/
    ├── rb036_henne_ei_apipa.png
    ├── rb036_diagnosebaum.svg
    └── rb036_diagnosebaum_preview.png
```

| Datei | Nutzen |
|---|---|
| `RB-036_Lernartikel.md` | 15 Kapitel, IPv4 Link-Local, APIPA, Clientdiagnose, DHCP, A/B-Tests, zwei fiktive Fälle, Lernfragen, Quellen |
| `RB-036_Praxis-Runbook.md` | 10 Arbeitsabschnitte für L1/L2, Sicherheitsgate, Diagnosematrix, Retest und Muster-Ticketkommentar |
| `assets/rb036_henne_ei_apipa.png` | Professionelle Henne-und-Ei-Infografik mit fünf Diagnosephasen |
| `assets/rb036_diagnosebaum.svg` | Editierbar/skalierbar als SVG, getrennte Fallpfade |
| `assets/rb036_diagnosebaum_preview.png` | PNG-Ansicht für GitHub-Pages-Veröffentlichung |
| `README.md` | Struktur, Quellen, Abgrenzung und Prüfstatus |

**Bildnachweisvorschlag:** „Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT“.

## Wichtigster Unterschied zu RB-035

- **RB-035:** gesamter DHCP-Adressvergabeprozess und dessen Unterbrechung.
- **RB-036:** konkretes Fehlerbild `169.254.x.x` einordnen, korrekten Adapter bestimmen und **beweisen**, wo die erwartete IPv4-Adressvergabe scheitert.
- **RB-034:** DNS-Störungen bei ansonsten brauchbarer IP-Konfiguration.

**Merksatz:** APIPA ist eine Link-Local-Adresse und ein Befund, **kein Schuldbeweis** gegen den DHCP-Server. Unter passenden Bedingungen funktioniert IPv4 innerhalb des lokalen Links; geroutete IPv4-Kommunikation über die APIPA-Adresse ist nicht vorgesehen.

## Sorgfalt und Sicherheit

- Erst `ipconfig /all`, Adapter-/DHCP-Status, Ereignisse und zugelassene A/B-Tests **lesen**.
- Nicht `ipconfig /release` über die einzige Fernverbindung; auch `renew` oder Adapterneustart nur mit Rückweg/Freigabe.
- Kein pauschales DNS-Flush, kein „Netzwerk zurücksetzen“ und keine statische Ersatz-IP ohne Befund.
- Kein ungenehmigtes Umstecken zwischen Netzwerk-Sicherheitszonen; keine Scope-, Relay-, VLAN-, NAC-, Firewall- oder Snooping-Änderung ohne Owner.
- IP-/MAC-Adressen, Gerätekennungen, interne Topologie und Nutzerinformationen geschützt speichern.
- Technische Angaben und Befehle sind recherchiert, **nicht am Windows-11-Testgerät validiert**; bei Praxistraining auf aktueller Windows-/Serverversion testen.

## Offizielle Quellen (22.11.2026)

- [Q1] https://learn.microsoft.com/de-de/windows-server/troubleshoot/how-to-use-automatic-tcpip-addressing-without-a-dh
- [Q2] https://learn.microsoft.com/en-us/windows-server/troubleshoot/troubleshoot-dhcp-issue
- [Q3] https://www.rfc-editor.org/rfc/rfc3927.html
- [Q4] https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-problems-dhcp-client
- [Q5] https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig
- [Q6] https://learn.microsoft.com/de-de/troubleshoot/windows-server/networking/troubleshoot-dhcp-guidance
- [Q7] https://learn.microsoft.com/de-de/windows-server/troubleshoot/troubleshoot-problems-on-dhcp-server
- [Q8] https://learn.microsoft.com/en-us/troubleshoot/windows-client/windows-tss/collect-data-analyze-troubleshoot-windows-networking-scenarios

## Training nach Abschluss der Reihe

1. Nur Störungsmeldung lesen, drei Hypothesen formulieren und einen trennenden ersten Test wählen.
2. In einer isolierten Laborumgebung eine erwartete DHCP-Adressvergabe gezielt unterbrechen; Zustand dokumentieren.
3. Packet Trace und Ereignisse gegen die Vermutung prüfen; Ursache korrigieren.
4. Ein **eigenes Runbook** schreiben, anschließend mit diesem Paket abgleichen.
5. Nach ungefähr 7 und 21 Tagen neue kombinierte DHCP-/DNS-/APIPA-Störung ohne Lösungsblatt bearbeiten.

**Transparenz:** Keine produktiven Systeme verändert, keine reale Störung bearbeitet, keine Änderung an deiner Website vorgenommen.
