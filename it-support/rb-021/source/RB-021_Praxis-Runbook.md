# RB-021 – Praxis-Runbook: Teams-Kamera oder Mikrofon funktioniert nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Support:** L1/L2 · **Stand:** 22.11.2026  
**Validierung:** Recherchiert, noch nicht praktisch getestet. Fiktive Beispielwerte.

> **Ziel:** Ursache mit kontrollierten Vergleichstests eingrenzen – **nicht** Teams, Treiber oder Windows-Datenschutz pauschal zurücksetzen.

## 1. Ticketaufnahme (L1)

| Frage | Festhalten |
|---|---|
| Kamera, Mikrofon oder beides? | Symptom, genaue Fehlermeldung, schwarzes Bild / kein Pegel / Gerät fehlt |
| Wo? | Teams Desktop, Teams Web, VDI/RDP, Windows-Version |
| Wer und seit wann? | Einzelperson oder mehrere; nach Update, Dockwechsel, Headsettausch? |
| Gerät? | Integriert/USB/Bluetooth; Modell, Verbindung, Mute/Abdeckung |
| Zeitkritisch? | Anstehendes Meeting; bei Bedarf genehmigte Ausweichlösung |

Einverständnis für Fernzugriff und Geräteprüfung erfragen. Keine Testaufnahme ohne Wissen der betroffenen Person anfertigen oder speichern.

## 2. Sofortige Hardware- und Anwendungskontrolle (L1)

- Kameraabdeckung / Hardware-Privacy-Schalter / Fn-Kamerataste prüfen.
- Headset-Mute, Teams-Mute und Windows-Eingabe **getrennt** betrachten.
- Kabel, USB-Port, Dock und Bluetoothverbindung kontrollieren; ggf. direkt am PC testen.
- Potenziell konkurrierende Anwendungen nach Rücksprache schließen.
- Ein zweites freigegebenes Gerät als A/B-Test nutzen, falls verfügbar.

**Ergebnis notieren:** Hardwarezweig plausibel **ja/nein/noch unklar**.

## 3. Unabhängiger Windows-Test (L1)

**Kamera:** Windows **Kamera-App** öffnen; liefert sie ein aktuelles Livebild? Gerät korrekt gewählt?  
**Mikrofon:** **Einstellungen → System → Sound → Eingabe → Mikrofon → Test starten**. Nach Testsatz Aufnahme/Pegel kontrollieren.  
**Berechtigungen:** **Einstellungen → Datenschutz & Sicherheit → Kamera / Mikrofon**; Geräte-/App-/Desktop-App-Zugriff nur nach Richtlinie prüfen oder ändern.

| Beobachtung | Weiterer Zweig |
|---|---|
| Windows-Kamera-App bzw. Windows-Mikrofontest fehlschlägt | Hardware, PnP, Treiber, Berechtigungen; bei Eingriffen L2 |
| Windows funktioniert, Teams Desktop nicht | Teams-Geräteauswahl, Teams-Mute, App-Berechtigung, Desktop/Web-Gegenprobe |
| Windows und Teams funktionieren, nur Meeting problematisch | Meetingstatus, Raum-/Meetingkontext und reproduzierbarer Anrufvergleich |

**Achtung:** Ein Gerät, das Windows als „OK“ meldet, kann trotzdem falsches Bild/keinen Ton liefern.

## 4. Teams Desktop prüfen (L1)

1. **Einstellungen und mehr → Einstellungen → Geräte** öffnen.
2. Unter **Mikrofon** und **Kamera** die gewünschte Hardware explizit auswählen.
3. Kameravorschau prüfen; Mikrofon über **Testanruf** testen, sofern verfügbar.
4. Im Meeting: Benutzer-Mute, Kamera-an/aus und Geräteliste kontrollieren.
5. Nach Änderung den gleichen Funktionstest wiederholen und Ergebnis dokumentieren.

**Grenze:** Der Testanruf steht laut Microsoft **nicht in Teams Web** zur Verfügung.

## 5. Teams Web / Remote-Desktop-Gegenprobe (L1 → L2)

**Wenn Desktop fehlschlägt, Windows funktioniert:** Nur sofern erlaubt, Browser-Teams mit identischem Gerät vergleichen. Browserberechtigung für die tatsächlich verwendete Teams-Website sowie Geräteauswahl prüfen.

**Nur im Browser fehlerhaft:** Website-/Browserfreigabe und verwaltete Browserrichtlinien untersuchen.  
**Nur in VDI/RDP fehlerhaft:** Auf dem **lokalen Endgerät** testen, dann Mikrofon-/Kameraumleitung und Teams-Optimierung durch L2 überprüfen lassen.  
**Mehrere Benutzer betroffen:** Gemeinsame Softwareversion, Richtlinie und Veränderungszeitpunkt aufnehmen, administrative Diagnose veranlassen.

## 6. Lesende PowerShell-Diagnose (L1/L2)

```powershell
# Nur derzeit vorhandene PnP-Geräte lesen; ändert nichts.
Get-PnpDevice -PresentOnly |
    Where-Object { $_.Class -in @('Camera','Image','AudioEndpoint','MEDIA') } |
    Select-Object Class, FriendlyName, Status, InstanceId |
    Sort-Object Class, FriendlyName

# Windows-Audiodienste nur ansehen, nicht neu starten.
Get-Service -Name 'Audiosrv','AudioEndpointBuilder' |
    Select-Object Name, Status, StartType

# Auffällige, vorhandene PnP-Geräte auflisten.
Get-PnpDevice -PresentOnly |
    Where-Object {
        $_.Status -ne 'OK' -and
        $_.Class -in @('Camera','Image','AudioEndpoint','MEDIA')
    } |
    Select-Object Class, FriendlyName, Status, Problem
```

**Bewertung:** `OK` beweist **nicht** funktionierende Aufnahme und keinen erfolgreichen Teams-Anruf. Geräte-IDs nicht unreflektiert in öffentlichen Tickets posten. Bei fehlendem Cmdlet prüfen, ob unterstütztes Windows/PowerShell-Kontext vorliegt.

## 7. Befundabhängige Korrektur (L1 oder L2 nach Berechtigung)

| Verifizierte Ursache | Maßnahme | Re-Test |
|---|---|---|
| Mute, Abdeckung, falsch verbunden | Mute lösen / Abdeckung öffnen / neu verbinden | Windows **und** Teams |
| In Teams falsche Kamera/Mikrofon gewählt | Gewünschtes Gerät auswählen | Teams-Vorschau/Testanruf |
| Zulässige Berechtigung fehlt | Nur relevante Freigabe nach Richtlinie | Windows/Teams oder Browser |
| Browserberechtigung blockiert | Freigabe der konkreten Teams-Website korrigieren | Teams Web |
| Nur über Dock/USB/BT defekt | Alternatives freigegebenes Setup vergleichen | Gleiches Gerät, anderer Anschluss |
| Windows-Gerät defekt oder nicht erkannt | Treiber-/Hardwarebearbeitung eskalieren | Nach freigegebener Maßnahme |
| RDP/VDI / zentrale Policy | An L2/Endpoint-/VDI-Team übergeben | Lokal gegen remote vergleichen |

**Verbotene Abkürzung:** Keine Treiberdeinstallation, keine Policy-Umgehung, kein wahlloses Cache-Löschen und keine systemweiten Dienstneustarts ohne Ursache, Freigabe und Folgenabschätzung.

## 8. Funktionsprüfung und Abschluss

- Kamera in Teams-Vorschau: korrektes **aktuelles** Bild?
- Mikrofon: verständliche Aufnahme/Testsprache; Teams-Mute aufgehoben und richtiges Gerät gewählt?
- Test im betroffenen Nutzungskontext (Desktop / Web / VDI); nach Dock-/Bluetoothwechsel bei Bedarf erneut prüfen.
- Ursache konkret benennen, nicht nur „Teams ging wieder“.

### Ticketkommentar – fiktiver Musterabschluss

> INC-021: Teams-Mikrofon ohne Übertragung; betroffen ein Windows-11-Client mit USB-Headset. USB-Headset im Windows-Eingabetest funktionsfähig. Teams Desktop hatte das Notebook-Mikrofon ausgewählt. In Teams → Einstellungen → Geräte das USB-Headset ausgewählt; Testanruf erfolgreich, Rückmeldung der Benutzerin bestätigt. Ursache: falsche Teams-Geräteauswahl. Kein Treiber-/Rechteingriff. **Fiktives Schulungsbeispiel, nicht praktisch durchgeführt.**

## 9. L2-Eskalation: Mindestinformationen

**Muss rein:** Nutzer-/Gerätezuordnung nach Datenschutzregeln, betroffene Komponente, Zeitpunkt, Teams-Variante, Hardware-/Verbindungsart, Windows-Testresultat, Teams-Auswahl, Desktop/Web-/VDI-Vergleich, Berechtigungsbefund, ggf. lesende PnP-/Dienststatusdaten, durchgeführte Maßnahmen und deren Wirkung.

**Nicht ohne Freigabe:** Ton-/Videoaufnahmen, Screenshots mit vertraulichen Teilnehmern, Logs mit unnötigen personenbezogenen Daten.

## 10. Offizielle technische Quellen und Transparenz

- [Microsoft: Kamera funktioniert nicht in Teams](https://support.microsoft.com/de-de/teams/meetings/my-camera-isn-t-working-in-microsoft-teams)
- [Microsoft: Mikrofon funktioniert nicht in Teams](https://support.microsoft.com/de-de/teams/meetings/my-microphone-isn-t-working-in-microsoft-teams)
- [Microsoft: Windows-Kameraberechtigungen](https://support.microsoft.com/de-de/windows/privacy/manage-app-permissions-for-a-camera-in-windows)
- [Microsoft: Windows-Mikrofonprobleme](https://support.microsoft.com/de-de/windows/hardware/drivers/fix-microphone-problems)
- [Microsoft: Teams-Geräteeinstellungen](https://support.microsoft.com/en-us/teams/notifications-settings/manage-your-device-settings-in-microsoft-teams)
- [Microsoft: Teams im Browser – Gerätezugriff](https://support.microsoft.com/en-us/teams/troubleshooting/troubleshoot-device-features-in-microsoft-teams-on-the-web)

**Recherchiert 22.11.2026.** Herstellerangaben können sich ändern. Die Anweisungen sind ein strukturiertes L1-/L2-Vorgehen; **praktische Validierung steht aus**. Abweichende Unternehmensrichtlinien und aktuelle Geräte-/App-Versionen gehen vor.
