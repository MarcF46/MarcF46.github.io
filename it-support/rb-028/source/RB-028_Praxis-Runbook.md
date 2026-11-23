# RB-028 – Praxis-Runbook: Microsoft-Office-Anwendung startet nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Support:** L1/L2 · **System:** Windows 11 / Office-Desktop (Word, Excel, PowerPoint)  
**Version:** 1.0 · **Recherche:** 22.11.2026  
**Status:** Aus Microsoft-Herstellerquellen abgeleitet. **Nicht an einem real gestörten System praktisch validiert.** Alle Ticketbeispiele fiktiv.

> **Sofortregel:** **App + genaue Fehlermeldung + Umfang → Normalstart / Office Safe Mode vergleichen → Add-ins/Startkomponenten oder Installation eingrenzen → nur freigegeben ändern → normalen Programmstart und Dateioperation belegen.**

## 1. Erstaufnahme und Priorisierung (L1)

- [ ] Betroffene App: **Word / Excel / PowerPoint / mehrere**? Desktop- oder Browser-App?
- [ ] **Symptom**: nichts sichtbar, Splashscreen, Absturz, „Keine Rückmeldung“, Login-/Lizenzfehler, nur bei Dateidoppelklick?
- [ ] Zeitpunkt, exakter Text/Code und Screenshot erfasst; Fenster nicht mit Passwort/Token dokumentieren.
- [ ] Windows-Version, Office-Produkt/Build (soweit verfügbar), Gerät und berechtigter Benutzerkontext erfasst.
- [ ] Nur ein Benutzer/PC oder mehrere betroffen? Gemeinsam genutzte Add-ins, Office-Build oder jüngste Änderungen?
- [ ] Anwendung ohne Datei startbar? Andere Office-Apps startbar? Ein Testdokument betroffen oder alle?
- [ ] Business-Impact, Datensicherung, laufende ungespeicherte Dokumente, Frist/SLA geklärt.
- [ ] Ggf. an **RB-019 (Outlook)** oder **RB-029 (Lizenzierung)** verweisen.

**Belegpaket:** `Gerät / Benutzerkontext / App / Office-Version / Fehlerzeit / genaue Meldung / Scope / Safe-Mode-Resultat / Änderungshistorie`.

## 2. Sicherheits-Gate vor Änderungen

- [ ] Nur lesende/risikoarme Tests ohne weitere Freigabe; alle Änderungen gemäß Unternehmensrichtlinie.
- [ ] Vor Beenden laufender Office-Prozesse: **ungespeicherte Arbeit** und Anwenderzustimmung klären.
- [ ] Vor Umbenennen/Verschieben von Vorlagen, Add-ins oder Startdateien: **Sicherung, Besitzer, Rückweg und Freigabe** geklärt.
- [ ] Keine Registry-Schlüssel ungesichert löschen, keine neuen lokalen Adminrechte verteilen, keine AV-/Makro-Schutzregeln abschalten.
- [ ] Bei zentralen Add-ins, Cloud-/DMS-Integrationen oder Click-to-Run-Deployment: Endpoint/Anwendungsteam einbeziehen.
- [ ] Office-Reparatur nur, wenn Produkt/Bereitstellungsweg, Arbeitsauswirkung, Freigabe und ggf. erneute Anmeldung geklärt sind.
- [ ] Logdaten und Screenshots geschützt speichern (Dateinamen/Benutzernamen können sensible Informationen enthalten).

**Stop-Kriterium:** Kein autorisierter Change-Pfad, kritische Produktivdaten gefährdet, Verdacht auf Malware, viele Clients betroffen → eskalieren.

## 3. Startfehler klassifizieren: vier Vergleiche

| Vergleich | Test | Folgerung |
|---|---|---|
| **Ohne vs. mit Datei** | App aus Startmenü ohne Datei; erst dann freigegebene Testdatei | Nur Datei betroffen → Dateipfad getrennt untersuchen |
| **App A vs. App B** | Word, Excel, PowerPoint getrennt starten | Nur eine betroffen → App-spezifischer Pfad plausibel |
| **Normal vs. Office Safe Mode** | `winword /safe`, `excel /safe`, `powerpnt /safe` | Normalfehler bei erfolgreichem Safe Mode → Startkomponenten eingrenzen |
| **Ein Benutzer/Gerät vs. Referenz** | Nur autorisierter Vergleich mit zweitem Profil/Gerät | Lokaler Kontext, Profil oder zentraler Rollout besser eingrenzbar |

**Wichtig:** Befunde **stets dokumentieren**, nicht aus der ersten Beobachtung die Ursache ableiten.

## 4. L1-Standarddiagnose: Office Safe Mode

1. [ ] Alle betroffenen Office-Fenster kontrolliert schließen; **nicht ungespeicherte Arbeit verlieren**.
2. [ ] `Windows + R` öffnen.
3. [ ] Genau **einen** Befehl entsprechend der betroffenen Desktop-App ausführen:

```text
winword /safe
excel /safe
powerpnt /safe
```

4. [ ] Startresultat und Titel „Abgesicherter Modus“ nach Möglichkeit bestätigen.
5. [ ] Noch **keine** Vorlagen/Registry-Einstellungen verändern.
6. [ ] Office-App schließen und erneut **normal** starten; Status vergleichen.

**Entscheidung:**

- **Safe Mode funktioniert, normal nicht:** Pfad A (Add-ins / Startvorlagen / benutzerspezifische Komponenten).
- **Safe Mode funktioniert ebenfalls nicht:** Pfad B (Installation / Ereignisse / Systemkontext).
- **App startet normal, nur eine Datei scheitert:** Pfad C (Dokument / Ablageort).
- **App startet, zeigt Lizenzmeldung:** Pfad D (Lizenz / Konto / RB-029).

**Microsoft:** https://support.microsoft.com/de-de/office/lifecycle/open-office-apps-in-safe-mode-on-a-windows-pc

## 5. Pfad A – Safe Mode erfolgreich, Normalstart fehlerhaft

- [ ] Betroffene App / Startdatum / Add-in-Liste inklusive Version und Zuweisung erfassen.
- [ ] `Datei → Optionen → Add-Ins → Verwalten: COM-Add-Ins → Los...` (je nach Oberfläche); ergänzend andere Add-in-Typen und deaktivierte Elemente.
- [ ] Nur **autorisierte**, nicht geschäftskritische Add-ins testweise deaktivieren; ursprünglichen Zustand notieren.
- [ ] App **normal** neu starten; verändert sich der Befund?
- [ ] Bei Erfolg nach Freigabe Add-ins **einzeln** reaktivieren; nach **jedem** Schritt Normalstart prüfen.
- [ ] Reproduzierbares fehlerhaftes Add-in gefunden? Hersteller, Version, Unternehmensverteilung und Updateweg dokumentieren; zuständiges Team einbeziehen.
- [ ] Kein Befund? Word: `winword /a` als **zusätzlichen Vergleich** prüfen; gesicherte globale Vorlagen/`Normal.dotm` bzw. Excel: XLSTART nach L2-Freigabe isolieren.
- [ ] Rückbau-/Sollzustand festhalten; keine nicht genehmigten dauerhaften Add-in-Deaktivierungen.

**Achtung:** Ein erfolgreicher Safe Mode identifiziert **noch keinen** einzelnen Auslöser. Auch Startressourcen, Vorlagen und bestimmte Benutzerkonfigurationen sind Kandidaten.

Hersteller: https://support.microsoft.com/de-de/office/lifecycle/i-get-a-stopped-working-error-when-i-start-office-applications-on-my-pc

## 6. Pfad B – Start auch im Safe Mode erfolglos

**Zuerst Befund sichern:**

- [ ] Exakte Fehlermeldung, Zeitstempel, Eventlog (`Application Error`, ggf. ID 1000/1001), Office-Version, letzter Change.
- [ ] Andere Office-Apps betroffen? Eventlog-Fehler in derselben Minute aufgetreten?
- [ ] Installation/Click-to-Run-Aktivität, Sicherheitsrichtlinien und Bereitstellungsstatus prüfen; keinen laufenden Vorgang erzwingen.
- [ ] Vergleich zu genehmigtem Referenzgerät / Office-Build und vom Administrator bekannten Problemen.
- [ ] Nach Autorisierung **Schnellreparatur** erwägen. Wenn nötig **Onlinereparatur** als umfassenderen Eingriff, unter Berücksichtigung von Netz und Anmeldung.
- [ ] Nach Reparatur normaler Appstart + Testdokument; bei Misserfolg L2/Endpoint und Crash-Log-Analyse.

**Windows 11:** `Einstellungen → Apps → Installierte Apps → Microsoft 365/Office → … → Ändern`. Abweichungen je Click-to-Run-/MSI-Setup beachten. Die Reparatur betrifft bei Suites **die gesamte Suite**.

**Keine Sofortmaßnahme:** Office deinstallieren, Benutzerprofil löschen, Registry bereinigen, Office-Build zurückrollen oder Dateisystemreparatur ohne Diagnose und Freigabe.

Hersteller: https://support.microsoft.com/de-de/office/lifecycle/repair-an-office-application

## 7. Pfad C und D – Dateifehler oder Aktivierung statt Absturz

**Pfad C: Nur einzelnes Dokument betroffen**

- [ ] App ohne Datei und mit neuer leerer Testdatei öffnen.
- [ ] Speicherort (lokal, Netzwerk, OneDrive/SharePoint), Zugriffsrechte und Version der betroffenen Datei abgleichen.
- [ ] Dateityp, mögliche Makros/Vorlagen/Erweiterungen und schreibgeschützten Zustand feststellen.
- [ ] Nicht Produktivdateien unautorisiert kopieren, Schutzansichten/Makrosicherheit deaktivieren oder Dateien „reparieren“, ohne Sicherung und Zustimmung.
- [ ] Ggf. an Datei-/DMS-/OneDrive-Team eskalieren.

**Pfad D: App öffnet, Lizenz-/Abo-Hinweis**

- [ ] Meldung, Kontotyp und zugewiesene Office-Edition aufnehmen.
- [ ] Mit Microsoft 365-/Lizenzteam verifizieren; ggf. RB-029 nutzen.
- [ ] Keine unautorisierte Kontoumstellung, Token-/Credentials-Bereinigung oder Seriennummernweitergabe.

## 8. Nur lesende Windows-Diagnose (L1+/L2)

```powershell
# Version und Startzeit des Betriebssystems
Get-CimInstance Win32_OperatingSystem |
  Select-Object Caption,Version,BuildNumber,LastBootUpTime

# Nur Prozessstatus (bei nicht laufenden Prozessen keine Ausgabe)
Get-Process WINWORD,EXCEL,POWERPNT -ErrorAction SilentlyContinue |
  Select-Object ProcessName,Id,StartTime,Responding

# Ereignisse 1000/1001: auf Office-Prozesse und Zeitraum eingrenzen
Get-WinEvent -FilterHashtable @{
  LogName='Application'; Id=1000,1001
  StartTime=(Get-Date).AddDays(-7)
} -MaxEvents 200 -ErrorAction SilentlyContinue |
  Where-Object { $_.Message -match 'WINWORD\.EXE|EXCEL\.EXE|POWERPNT\.EXE' } |
  Select-Object TimeCreated,Id,ProviderName,Message
```

- [ ] Zusätzlich `eventvwr.msc` und – soweit vorhanden – `perfmon /rel` prüfen.
- [ ] ID 1000/1001 kann Crashzeit, Anwendung, Modul und Exception liefern. **Modulname allein ist kein Ursachenbeweis.**
- [ ] `Get-Process` und Eventlog-Abfragen sind lesend; **kein** automatisches `Stop-Process`.
- [ ] Betroffenes Protokoll nur geschützt exportieren; ggf. L2/Privacy vor Weitergabe.

Quelle: https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior

## 9. Erfolgskontrolle, Eskalation und Abschluss

**Erfolg nur bestätigen, wenn:**

- [ ] App startet **normal**, nicht nur im Office Safe Mode.
- [ ] Neuer Testinhalt lässt sich anlegen, bearbeiten, speichern, schließen und erneut öffnen.
- [ ] Ein erneuter Normalstart funktioniert ohne dieselbe Meldung.
- [ ] Erforderliche geschäftliche Add-ins/Vorlagen funktionieren nach der Maßnahme.
- [ ] Benutzer bestätigt die Arbeitsfähigkeit – sofern erreichbar und vorgesehen.
- [ ] Ursprünglicher Fehlercode, Ursache/Hypothese, Maßnahme, Test und ggf. Restrisiko sauber dokumentiert.

**Eskalieren bei:** Unternehmensweiter Häufung, zentralem Add-in/Policy-/Office-Rollout, fehlender Berechtigung, Verdacht auf Profil-/Installationskorruption, Crash ohne identifizierbare Ursache, Datenschutzrisiko oder Scheitern genehmigter Standardmaßnahmen.

**L2-Übergabedaten:** Gerät/Office-Edition und Build, fehlerschlagende App, Safe-Mode-Vergleich, Eventzeit, Event-ID, Exception/Modul soweit vorhanden, Änderungsverlauf, Umfang, genehmigte Tests, Ausgangsstatus und Testnachweis.

## 10. Ticketdokumentation und kompakter Lerncheck

### Muster-Ticketkommentar – fiktiv, nicht durchgeführt

> **Problem:** Word öffnet sich beim normalen Start nicht; Fenster schließt nach dem Splashscreen. Excel und PowerPoint funktionieren.  
> **Diagnose:** `winword /safe` startet Word; Normalstart wiederholt fehlgeschlagen. COM-Add-ins aufgelistet, zeitlicher Zusammenhang mit neu verteiltem DMS-Add-in als Hypothese notiert.  
> **Maßnahme (geplant):** Nach Freigabe Add-ins einzeln isolieren; bei reproduzierbarem Befund Hersteller-/Endpoint-Team für Add-in-Update einschalten.  
> **Erfolgskontrolle:** Noch ausstehend – kein realer Funktionstest.  
> **Status:** In Diagnose / Übergabe an L2.

### L1-Status – Dreisatz-Kommunikation

> **Problem:** Word beendet sich unmittelbar beim Start, während Excel funktioniert.  
> **Analyse:** Der Office Safe Mode startet; damit liegt der Verdacht auf einer zusätzlichen Startkomponente, nicht zwingend auf einer defekten Installation.  
> **Nächster Schritt:** Add-ins und Vorlagen nach Freigabe gezielt vergleichen und den normalen Start erneut prüfen.

### Active Recall – drei schnelle Fragen

1. Warum ist `winword /safe` diagnostisch nützlich, aber kein Beweis für ein bestimmtes Add-in?
2. Was unterscheidet die Pfade „Safe Mode funktioniert“ und „Safe Mode funktioniert nicht“?
3. Was musst du **nach** erfolgreicher Office-Reparatur zusätzlich zum Programmstart kontrollieren?

**Lerntransfer:** Ein Excel-Fehler tritt nur beim Doppelklick auf die Arbeitsmappe eines Netzlaufwerks auf, während Excel leer startet. Welchen Pfad nutzt du zuerst, und welche Änderung unterlässt du?

---

## Quellen – offizielle Microsoft-Dokumentation (Recherche 22.11.2026)

- https://support.microsoft.com/de-de/office/lifecycle/open-office-apps-in-safe-mode-on-a-windows-pc
- https://support.microsoft.com/de-de/office/lifecycle/i-get-a-stopped-working-error-when-i-start-office-applications-on-my-pc
- https://support.microsoft.com/de-de/office/lifecycle/repair-an-office-application
- https://support.microsoft.com/de-de/word/how-to-troubleshoot-problems-that-occur-when-you-start-or-use-word
- https://support.microsoft.com/de-de/excel/excel-not-responding-hangs-freezes-or-stops-working
- https://support.microsoft.com/de-de/microsoft-365-activation-licensing/office-install/unlicensed-product-and-activation-errors-in-office
- https://learn.microsoft.com/en-us/troubleshoot/windows-server/performance/troubleshoot-application-service-crashing-behavior

**Transparenz:** Diagnoseschema auf Basis verifizierter Herstellerquellen; Musterwerte und Ticketkommentar sind fiktiv, praktische Validierung steht aus.
