# Praxis-Runbook RB-019 – Outlook-Profil beschädigt

**Zweck:** Schnelle, sichere Arbeitsanweisung bei Verdacht auf ein defektes **klassisches Outlook-Profil**.  
**Level:** L1/L2 nach Berechtigungen · **Stand:** 08.11.2026 · **Validierung:** Recherchiert, nicht praktisch getestet.  
**Beispiel:** Benutzer `m.mustermann@firma.example`; sämtliche Angaben sind fiktiv.

> **Sicherheitsregel:** Vor jeder Profilbereinigung oder Datendateireparatur OST-/PST-Bestand, Archive, ungesendete Nachrichten und unsynchronisierte Änderungen prüfen. **PST niemals ungeprüft löschen.**

## 1. Erstaufnahme (L1)

- [ ] Benutzer/Computer/Outlook-Version erfassen (**klassisches** oder **neues** Outlook).
- [ ] Exakte Fehlermeldung, Zeitpunkt, letzte Änderungen und Betroffene dokumentieren.
- [ ] Lokal gespeicherte Archive/Datendateien und mögliche Offlineinhalte erfragen.
- [ ] Bei mehreren betroffenen Benutzern zentralen Microsoft-365-Dienststatus prüfen lassen.

## 2. Gegenprobe: Postfach in Outlook im Web (L1)

- [ ] Mit Unternehmenszugang Outlook im Web öffnen (z. B. `https://outlook.office.com/`).
- [ ] Sind Mails/Kalender dort aktuell und erreichbar?
- [ ] **Nur Desktop betroffen:** lokale Diagnose fortsetzen.
- [ ] **Web ebenfalls betroffen:** Authentifizierung, Lizenz, Netzwerk, Exchange-Dienst und ggf. RB-006 prüfen.

> Webzugriff erfolgreich = lokale Ursache wahrscheinlicher, **nicht** automatisch ein bewiesener Profildefekt.

## 3. Klassisches Outlook im abgesicherten Modus starten (L1)

**Ausführungsort:** Windows-Client. **Art:** Diagnose ohne Änderung der Profildateien.

```text
Windows-Taste + R
outlook.exe /safe
```

**Schreibweise:** Leerzeichen nach `.exe`, danach `/safe`. Der Outlook-Abgesicherte-Modus deaktiviert testweise Add-ins und ist **nicht** der Windows-Abgesicherte-Modus.

- [ ] Start funktioniert → Add-in-Verdacht. `Datei → Optionen → Add-Ins → COM-Add-Ins → Gehe zu`. Add-ins dokumentieren, kontrolliert deaktivieren und einzeln testen.
- [ ] Start scheitert weiterhin → Profil-/Datendatei-/Installationsdiagnose.

## 4. Lesende PowerShell-Abfragen (L1/L2)

**Ausführungsort:** Betroffener Client; keine administrativen Änderungen. 

```powershell
# Liest einen eventuell laufenden klassischen Outlook-Prozess aus.
Get-Process -Name OUTLOOK -ErrorAction SilentlyContinue |
    # Zeigt Prozess-ID und Status an.
    Select-Object ProcessName, Id, Responding

# Definiert den üblichen OST-Cacheordner des aktuellen Benutzers.
$pfad = Join-Path $env:LOCALAPPDATA 'Microsoft\Outlook'

# Listet OST-Dateien ohne Veränderungen auf.
Get-ChildItem -Path $pfad -Filter '*.ost' -File -ErrorAction SilentlyContinue |
    # Dateigröße, Datum und Speicherort dokumentieren.
    Select-Object Name, Length, LastWriteTime, FullName
```

**Interpretation:** Vorhandene OST beweist keinen Schaden; nicht vorhandene OST schließt andere Outlook-Probleme nicht aus. Dateien über `Datei → Kontoeinstellungen → Datendateien` dem Profil zuordnen.

## 5. Neues Testprofil statt altes Profil löschen (L1/L2)

**Nur klassisches Outlook.** Vorher lokale Daten dokumentieren und erforderliche Freigabe einholen.

```text
Windows-Taste + R
outlook.exe /profiles
```

- [ ] Profilassistent öffnen; alternativ Umschalt-Taste beim Outlook-Start.
- [ ] `Neu` → Testprofil `Outlook-Test-RB019` anlegen.
- [ ] Geschäftskonto gemäß Unternehmensvorgabe hinzufügen.
- [ ] Neues Profil auswählen und Anmeldung sowie Senden/Empfangen testen.
- [ ] **Neu funktioniert, alt nicht:** Profilproblem stark eingegrenzt. Altes Profil **noch nicht** löschen.
- [ ] **Neu scheitert ebenfalls:** Autodiscover, Konto, Authentifizierung, Add-ins und Installation prüfen; ggf. eskalieren.

## 6. PST/OST und Reparaturentscheidung (L2 / genehmigter Eingriff)

| Befund | Maßnahme |
|---|---|
| Beschädigte oder nicht lesbare **PST** | **Kopie sichern**, anschließend `SCANPST.EXE` gemäß Microsoft-Anleitung; Ergebnis und wiederhergestellte Inhalte prüfen. |
| Tatsächlich defekte **OST** eines Exchange-Postfachs | Cloud-/Serverbestand und Offlineänderungen prüfen; anschließend nach Freigabe Cache neu aufbauen lassen. |
| Neues Profil funktioniert | Nach Datenprüfung und Freigabe ggf. neues Profil als Standard verwenden. |
| `Datei → Kontoeinstellungen → E-Mail → Reparieren` verfügbar | Vorgesehenen Profilreparatur-Assistenten nach Versionsprüfung einsetzen. |
| **Neues Outlook** betroffen | Nicht die klassischen `/profiles`/OST-Anweisungen verwenden; App-/Kontodiagnose und Windows-Reparaturoptionen prüfen. |
| Outlook startet trotz Profilwechsel nicht | Office-Updates, Start-/Absturzereignisse, Add-ins, Office-Reparatur untersuchen. |

**Keine Routineaktion:** PST löschen, OST blind entfernen, Registry-Profilzweige löschen, Anmeldedaten massenhaft löschen oder Office komplett neu installieren.

## 7. Funktionstest mit Benutzer

- [ ] Outlook startet mehrfach erfolgreich.
- [ ] Richtiger Benutzer, Kalender, Kontakte, Posteingang sichtbar.
- [ ] Testmail senden/empfangen (an genehmigte Adresse).
- [ ] Lokale Archive/PST-Dateien und wichtige Ordner bei Bedarf verfügbar.
- [ ] Keine neue Fehlermeldung nach erneutem Start.
- [ ] Änderungen und Ergebnis dokumentiert.

## 8. Eskalation

**An L2/Exchange-/Workplace-Team, wenn:** PST mit möglicherweise exklusiven Daten betroffen, OST mit unsynchronisierten Inhalten, Konto-/Autodiscover-Fehler, Profilvergleich uneindeutig, mehrfacher Fehler trotz neuem Profil, Firmenrichtlinien/Lizenzen, mehrere Benutzer oder zentrale Dienststörung.

**Übergabe:** Fehlertext, Zeit, Outlook-Version, Webvergleich, Safe-Mode-Test, Testprofil-Ergebnis, PST-/OST-Sicherungsstatus, ggf. Event-ID 1000, bisherige Maßnahmen und Auswirkung. Keine Passwörter oder unnötigen Mailinhalte weitergeben.

## 9. Muster-Ticketkommentar (fiktiv)

**INC-019:** Klassisches Outlook öffnet Ordnersatz nicht. Outlook im Web funktioniert. Safe Mode ohne Erfolg. PST-Archiv vorab identifiziert und gesichert. Neues Testprofil erstellt; Outlook startet, Posteingang und Kalender synchronisieren erfolgreich. Nach Freigabe neues Profil verwendet, ursprüngliches Profil zunächst erhalten. Sende-/Empfangstest erfolgreich. **Status: gelöst (fiktive Übung, nicht real durchgeführt).**

## 10. Offizielle Quellen

- [Microsoft – Outlook-Profil erstellen](https://support.microsoft.com/de-de/outlook/create-an-outlook-profile)
- [Microsoft – Profil reparieren](https://support.microsoft.com/de-de/outlook/fix-your-outlook-email-connection-by-repairing-your-profile)
- [Microsoft – PST/OST reparieren](https://support.microsoft.com/de-de/outlook/repair-outlook-data-files-pst-and-ost)
- [Microsoft – Outlook-Abgesicherter-Modus](https://support.microsoft.com/de-de/office/öffnen-von-outlook-im-abgesicherten-modus-f394c2ee-b2af-e97a-64ee-35cd24414811)
- [Microsoft – Outlook-Startfehler](https://support.microsoft.com/de-de/outlook/i-can-t-start-microsoft-outlook-or-receive-the-error-cannot-start-microsoft-outlook-cannot-open-the)
- [Microsoft – Outlook-Verbindungsprobleme](https://learn.microsoft.com/de-de/troubleshoot/exchange/outlook-issues/outlook-connection-issues)

**Fachlicher Bearbeitungsstand:** Technisch recherchiert, nicht im Produktivbetrieb praktisch getestet.
