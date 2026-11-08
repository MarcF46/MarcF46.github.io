# RB-020 – Praxis-Runbook: E-Mail-Anhang lässt sich nicht öffnen

**Support-Level:** L1, bei Sicherheits-/Serverbefunden L2/Security  
**Status:** Recherchiert · praktische Validierung ausstehend  
**Gültigkeit:** Windows 11, Outlook klassisch / neu / Web, Unternehmensumgebungen mit Exchange Online  
**Wichtig:** Ausschließlich freigegebene, erwartete Anhänge untersuchen. Verdächtige Dateien nicht öffnen, weiterleiten oder Schutzmaßnahmen umgehen.

## A. Fehleraufnahme (L1)

- [ ] Exakte Fehlermeldung, Zeitpunkt, Absender und betroffene Datei erfasst.
- [ ] Dateiendung, Größe und Anzahl der betroffenen Anhänge dokumentiert.
- [ ] Klären: Vorschau, Download oder Öffnen in einer Zielanwendung schlägt fehl?
- [ ] Outlook-Version und Unternehmens-/Privatkonto erfasst.
- [ ] Verdachtsmomente auf Phishing, Malware oder Schutzblockierung geprüft.

**Bei verdächtiger Datei sofort:** Nicht öffnen! Sicherheitsprozess befolgen und L2/Security eskalieren.

## B. Diagnosefolge (L1)

| Test / Frage | Ergebnis | Nächster Schritt |
|---|---|---|
| Nachricht oder Anhang fehlt bereits im Postfach? | Ja | Zustellung / Quarantäne durch L2 prüfen |
| Gibt Outlook eine aktive Sicherheitsblockierung aus? | Ja | Keine Umgehung; Security-Befund prüfen lassen |
| Funktioniert dieselbe **freigegebene** Datei in Outlook im Web? | Ja, aber Desktop nein | Client, Download, Dateizuordnung, Office-App |
| Funktioniert nur Vorschau nicht? | Ja | Vorgesehene App-Öffnung (nur vertrauenswürdige Datei), Previewer untersuchen |
| Funktionieren lokale harmlose Testdateien gleichen Typs? | Nein | Standard-App / Anwendung prüfen |
| Nur diese eine freigegebene Datei betroffen? | Ja | Integrität und Dateiquelle über autorisierte Referenzkopie prüfen |
| Mehrere Benutzer / verschiedene Geräte betroffen? | Ja | Zentrale Regeln, Dienst- oder Sicherheitsbefund untersuchen |

## C. Leseabfragen in PowerShell

**Ort:** Benutzerrechner. **Nur** für selbst erstellte oder geprüfte, autorisierte Testdateien.

```powershell
# Pfad auf eine freigegebene, ungefährliche Testdatei anpassen.
$pfad = 'C:\Support-Test\Beispiel.txt'

# Existenz am angegebenen Ort prüfen.
Test-Path -LiteralPath $pfad

# Namen, Dateiendung, Größe und Pfad anzeigen.
Get-Item -LiteralPath $pfad |
    Select-Object Name, Extension, Length, FullName

# SHA-256-Hash zum Vergleich mit vertrauenswürdiger Referenz berechnen.
Get-FileHash -LiteralPath $pfad -Algorithm SHA256
```

**Interpretation:** Hashgleichheit bedeutet **inhaltliche Übereinstimmung**, nicht Sicherheitsfreigabe. Eine Dateiendung beweist keinen ungefährlichen Inhalt.

## D. Befundabhängige Lösung

- **Keine passende App:** Genehmigte App installieren / passende Standard-App unter `Einstellungen → Apps → Standard-Apps` zuordnen.
- **Vorschaufehler:** Freigegebenen Anhang alternativ in der passenden, genehmigten Anwendung öffnen; Vorschau-/Clientproblem separat dokumentieren.
- **Beschädigte Datei:** Intakte Kopie über freigegebenen Unternehmensweg erbitten; nicht wahllos Dateiendung ändern.
- **Office-App defekt:** Dokumentierte Reparaturmaßnahme nach Freigabe; keine pauschale Neuinstallation.
- **Geschützte Ansicht:** Sicherheitshinweis beachten; Bearbeitung nur nach Prüfung des Dokuments und erlaubtem Unternehmensverfahren.
- **Outlook-Blockierung / Defender-Quarantäne:** **Keine** Blockade abschalten oder durch ZIP/Umbenennen umgehen. L2/Security entscheidet über den zulässigen Weg.
- **Zentraler Fehler:** L2 prüft Outlook/Exchange/Defender/Dienststatus.

## E. Erfolgskontrolle

- [ ] Freigegebene Datei lässt sich in der vorgesehenen Anwendung öffnen.
- [ ] Inhalt/Version und erforderliche Funktion (z. B. Lesen/Bearbeiten) kontrolliert.
- [ ] Sicherheitsvorgaben bleiben aktiviert.
- [ ] Ursache, getestete Wege und Ergebnis im Ticket dokumentiert.

## F. Eskalation an L2/Security

**Sofort**, wenn Sicherheitswarnung/Quarantäne, fragwürdiger Dateityp, Unternehmensrichtlinien, Datenverlustverdacht, mehrere Betroffene oder fehlende Rechte vorliegen. Übergeben: exakte Meldung, Anhangstyp, Zeit, Benutzer, Outlook-Version, Webvergleich, Prüfresultate und vorhandene Sicherheitsereignisnummern. **Originalanhänge nicht unkontrolliert weiterleiten.**

## G. Beispiel-Ticketnotiz (fiktiv)

**INC-020 · Fehlerbild:** XLSX-Anhang in Outlook Desktop öffnet sich nicht.  
**Diagnose:** Identität und erwarteten Absender geprüft; Webvergleich erfolgreich. Auf dem Client keine passende genehmigte Tabellen-App zugeordnet.  
**Maßnahme:** Bereitstellung der genehmigten Anwendung, Standardzuordnung eingerichtet.  
**Erfolg:** Harmloser XLSX-Test und freigegebener Anhang erfolgreich geöffnet.  
**Status:** Gelöst – *nur Beispiel, nicht real getestet*.

## Quellen (Microsoft)

- [Anlagen öffnen / speichern](https://support.microsoft.com/de-de/outlook/mail/open-save-and-edit-attachments-received-in-outlook)
- [Blockierte Anlagen](https://support.microsoft.com/de-de/outlook/blocked-attachments-in-outlook)
- [Geschützte Ansicht](https://support.microsoft.com/de-de/office/collab-files/what-is-protected-view)
- [Safe Attachments](https://learn.microsoft.com/de-de/defender-office-365/safe-attachments-about?view=o365-worldwide)
- [Standard-Apps](https://support.microsoft.com/de-de/windows/apps/change-default-apps-in-windows)
- [Get-FileHash](https://learn.microsoft.com/de-de/powershell/module/microsoft.powershell.utility/get-filehash)

**Verweis:** Vollständige Erklärungen, Diagramme, Anki und Sicherheitskontext enthält `RB-020_Lernartikel.md`.
