# RB-013 – Praxis-Runbook: Softwareanforderung und Installation

**Typ:** Service Request / bei Installationsfehlern Incident  
**Level:** L1 / L2 · **Version:** 1.0 · **Stand:** 08.11.2026  
**Status:** Recherchierte Arbeitsanweisung; nicht praktisch validiert.  
**Vertiefung:** [Ausführlicher RB-013-Lernartikel](RB-013_Lernartikel.md)

> **Ziel:** Genehmigte und korrekt lizenzierte Software sicher bereitstellen und ihre Nutzbarkeit belegen. **Keine unfreigegebene Installation.**

## 1. Intake – bevor die Installation beginnt

- [ ] Benutzer und Zielgerät identifiziert (Gerätename, Windows-Version, Standort).
- [ ] Software, Hersteller, Edition und gewünschte Version bekannt.
- [ ] Fachlicher Zweck und gewünschter Bereitstellungstermin dokumentiert.
- [ ] Vorhandene Installation oder Alternative im Standardsoftwarekatalog geprüft.
- [ ] Fachliche Freigabe, IT-Sicherheitsvorgaben und Lizenzstatus geklärt.
- [ ] Zuständigkeit und berechtigter Bereitstellungsweg bekannt.

**Stop-Kriterien:** Unklarer Hersteller/Download, fehlende Genehmigung oder Lizenz, Sicherheitswarnung, unbekanntes Paket → **nicht eigenmächtig installieren**, an zuständige Stelle weiterleiten.

## 2. Bereitstellungsweg auswählen

| Befund | Nächste Aktion |
|---|---|
| App im **Intune Company Portal** verfügbar | Benutzer zur freigegebenen Installation anleiten; Status prüfen. |
| App im **Configuration Manager Software Center** verfügbar | Installation und gegebenenfalls Genehmigungsprozess im Software Center prüfen. |
| App nicht sichtbar | App-Zuweisung, Gruppen, Gerätezustand und Requirements zentral prüfen lassen. |
| Freigegebenes MSI-Paket, manuelle Installation erlaubt | Paketquelle und Integrität prüfen, genehmigt installieren, loggen und testen. |
| Installationsfehler | Rückgabecode, Log, Kontext und Erkennungsregel untersuchen. |

## 3. Zielgerät prüfen – lesende Befehle

**Ausführungsort:** Betroffener Windows-Client oder genehmigte Remoteverwaltung.

```powershell
# Fragt Windows-Version und Betriebssystemarchitektur ab.
Get-CimInstance -ClassName Win32_OperatingSystem |
    Select-Object Caption, Version, OSArchitecture

# Ermittelt den freien Speicherplatz auf C:.
Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DeviceID='C:'" |
    Select-Object DeviceID, FreeSpace, Size

# Zeigt einen Ausschnitt der Software-Einträge in der Registry.
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*' |
    Where-Object DisplayName |
    Select-Object DisplayName, DisplayVersion, Publisher
```

**Interpretation:** Softwareeinträge können fehlen, vor allem bei benutzerbezogenen, portablen und Store-/MSIX-Apps. Weitere Details im [Lernartikel](RB-013_Lernartikel.md#9-powershell-lesende-vorprüfung-auf-dem-windows-client).

## 4. Installation kontrolliert ausführen

- [ ] Versions- und Architekturkompatibilität kontrolliert.
- [ ] Verifizierte, freigegebene Quelle verwendet.
- [ ] Installationsmethode nach Unternehmensprozess gewählt.
- [ ] Bei MSI-/EXE-Paketen korrekte Herstellerparameter und benötigten Kontext verwendet.
- [ ] Rückgabecode und gegebenenfalls Logdatei dokumentiert.
- [ ] Notwendige Neustarts im geeigneten Zeitfenster abgestimmt.

**Beispiel einer verändernden MSI-Installation – nur mit Freigabe:**

```powershell
# Startet eine genehmigte MSI-Installation ohne Dialoge.
# /i: Installieren, /qn: ohne GUI, /norestart: nicht automatisch neu starten.
# /L*v: ausführliche Protokollierung; Zielordner muss bereits existieren.
msiexec.exe /i "C:\IT-Pakete\Freigabe\Anwendung.msi" /qn /norestart /L*v "C:\IT-Logs\Anwendung-install.log"
```

**Wichtig:** MSI-Schalter gelten nicht automatisch für EXE-Installer. Bei Intune erforderliche Erkennungsregeln und Rückgabecodes müssen passend konfiguriert sein.

## 5. Wenn Installation fehlschlägt

| Fehler / Befund | Nächste Prüfung |
|---|---|
| `1603` | MSI-Log, vorausgehende Fehlermeldungen und Aktionen analysieren – kein eindeutiger Ursachenbeweis. |
| `1618` | Andere laufende MSI-Installation prüfen und Abschluss abwarten. |
| `3010` | Erfolgreiche Installation, Neustart noch nötig – koordiniert nachholen. |
| „Nicht installiert“ trotz Setup-Erfolg | App-Dateien, Version, Erkennungsregel, 32-/64-Bit-Pfad und Kontext prüfen. |
| Company Portal: App nicht sichtbar | Intune-Zuweisung, Benutzermitgliedschaft, Plattform und Gerätezustand prüfen. |
| App vorhanden, aber Lizenz fehlt | Lizenzzuweisung und passende Anmeldung prüfen, nicht blind neu installieren. |

**Intune-Logverzeichnis:** `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`  
**Typische Logs:** `AppWorkload.log`, `AppActionProcessor.log`, `IntuneManagementExtension.log`. Logs nur mit passender Berechtigung einsehen; personenbezogene und sicherheitsrelevante Inhalte bei der Weitergabe bereinigen.

## 6. Abschluss und Eskalation

**Funktionsprüfung:**

- [ ] Gewünschte Version ist installiert und erkannt.
- [ ] Mitarbeiter kann das Programm öffnen.
- [ ] Erforderliche Unternehmensanmeldung und Lizenz funktionieren.
- [ ] Eine passende Arbeitsaufgabe wurde erfolgreich durchgeführt.
- [ ] Der Mitarbeiter hat das Ergebnis bestätigt.

**An L2 / Paketierung eskalieren bei:** fehlender Freigabe, Zuweisungs-/Erkennungsfehlern, fehlenden Lizenzen oder erforderlichen Änderungen am zentralen Deployment, mehrfachen Installationsfehlern und mehreren betroffenen Geräten. Status, Gerätekennung, Version, Fehlermeldung und relevante bereinigte Logs mitsenden.

### Muster-Ticketkommentar (fiktiv)

**SR-013 – Anforderung:** Genehmigter PDF-Editor auf Windows-11-Laptop benötigt.  
**Prüfung:** Fachliche Genehmigung, Lizenz und Gerätekompatibilität bestätigt.  
**Maßnahme:** Software über freigegebenes Unternehmensportal bereitgestellt.  
**Ergebnis:** Start, Firmenanmeldung, Aktivierung sowie Öffnen/Bearbeiten/Speichern einer Testdatei erfolgreich.  
**Status:** Erledigt. *Fiktives Beispiel, keine reale Installation.*

## Herstellerreferenzen

- [Intune Win32-App-Zuweisung und Erkennungsregeln](https://learn.microsoft.com/en-us/mem/intune-service/apps/apps-win32-add)
- [Intune Unternehmensportal für Windows](https://learn.microsoft.com/de-de/intune/user-help/apps/install-apps-windows)
- [Configuration Manager Software Center](https://learn.microsoft.com/en-us/mem/configmgr/core/understand/software-center)
- [Intune Management Extension und Clientlogs](https://learn.microsoft.com/de-de/intune/device-management/tools/management-extension-windows)
- [Windows Installer-Rückgabecodes](https://learn.microsoft.com/de-de/windows/win32/msi/error-codes)

*Eigene Dokumentationskonzeption; Stand 08.11.2026. Praktische Validierung ausstehend.*
