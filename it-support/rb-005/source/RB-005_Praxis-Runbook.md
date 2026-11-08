# RB-005 – Praxis-Runbook: Zugriff auf Datei oder Ordner verweigert

**Zweck:** Kompakte L1/L2-Arbeitsanweisung · **Version:** 1.1 · **Stand:** 08.11.2026  
**Status:** Recherchiert, nicht praktisch validiert. **Kein Berechtigungswechsel ohne dokumentierte Freigabe!**

## 1. Ticket aufnehmen (L1)

- [ ] Exakte Fehlermeldung und UNC-Pfad `\\FS01\Projekte\Einkauf` dokumentieren.
- [ ] Betroffene Operation klären: **Ordner öffnen / Datei lesen / schreiben / löschen**?
- [ ] Wer ist betroffen? Einzelner Benutzer, Gruppe oder mehrere Standorte?
- [ ] Anmeldekonto, Computername, Beginn, Änderungen (Gruppe, Team, VPN) notieren.
- [ ] Fachlich erlaubte Soll-Berechtigung bei der zuständigen Stelle klären.

## 2. Geeigneten Diagnoseweg wählen

| Ort | Geeignete Vorgehensweise |
|---|---|
| **Betroffener Client** | Anwender via Bildschirmfreigabe anleiten; `whoami` und Netzwerkverbindung **im Benutzerkontext** prüfen. |
| **AD-Administrationsplatz** | AD-Gruppen mit RSAT/PowerShell lesend abfragen. |
| **Fileserver FS01** | Share-ACL mit `Get-SmbShareAccess` und lokale NTFS-ACL mit `Get-Acl` / `icacls` prüfen. |
| **Kein Zugang** | Vor-Ort- oder zuständigen Infrastruktur-Support einschalten. |

## 3. Erste Prüfungen (L1)

**Ausführungsort:** betroffener Windows-Client.

```powershell
# Prüft die TCP-Verbindung zu SMB auf dem Fileserver.
# True zeigt nur einen erreichbaren Port, noch keine Berechtigung.
Test-NetConnection -ComputerName 'FS01' -Port 445

# Zeigt den Benutzer der aktuellen Sitzung.
whoami

# Zeigt Gruppen, die im aktuellen Token enthalten sind.
# UNBEDINGT im Kontext des betroffenen Mitarbeiters ausführen.
whoami /groups

# Zeigt aktive/gespeicherte SMB-Netzlaufwerkszuordnungen.
Get-SmbMapping | Select-Object LocalPath, RemotePath, Status
```

**Entscheidung:** TCP 445 **nicht** erreichbar → Netzwerk/DNS/VPN/Firewall/Server prüfen. Port erreichbar → Anmeldung, Freigabe und NTFS weiter untersuchen.

## 4. Freigabeberechtigungen kontrollieren (L2)

**Ausführungsort:** **FS01**, angemeldeter und berechtigter Administrator.

```powershell
# Prüft, welcher lokale Ordner hinter der Freigabe steht.
Get-SmbShare -Name 'Projekte' | Select-Object Name, Path

# Zeigt Berechtigungsregeln der SMB-Freigabe an.
Get-SmbShareAccess -Name 'Projekte' |
    Select-Object AccountName, AccessControlType, AccessRight
```

Bei fehlender Berechtigung: **nicht automatisch erhöhen**. Soll-Berechtigung und Genehmigung klären.

## 5. NTFS-Berechtigungen kontrollieren (L2)

**Ausführungsort:** **FS01**; Pfad ist ein lokaler Serverpfad.

```powershell
# Pfad auf dem Fileserver, nicht der UNC-Pfad am Client.
$ordner = 'D:\Freigaben\Projekte\Einkauf'

# NTFS-Sicherheitsinformationen des Ordners lesen.
$acl = Get-Acl -LiteralPath $ordner

# Erlaubte, verweigerte und geerbte Regeln zeigen.
$acl.Access |
    Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited

# Alternative reine Leseanzeige mit Windows-Kommandozeile.
icacls 'D:\Freigaben\Projekte\Einkauf'
```

Share **und** NTFS müssen die benötigte Operation erlauben. Weitere Richtlinien sind möglich. Bei komplexen Rechten in der GUI **Eigenschaften → Sicherheit → Erweitert → Effektiver Zugriff** untersuchen.

## 6. Neue AD-Gruppenmitgliedschaft? (L1/L2)

**Ausführungsort:** AD-Administrationsplatz mit ActiveDirectory-Modul.

```powershell
# Liest im AD eingetragene Gruppen des Benutzers.
Get-ADPrincipalGroupMembership -Identity 'a.meyer' |
    Select-Object -ExpandProperty Name |
    Sort-Object
```

**Abgleich:** `Get-ADPrincipalGroupMembership` zeigt AD-Zugehörigkeiten; `whoami /groups` zeigt Gruppen im **aktuellen Sitzungstoken**. Fehlt dort die neue Gruppe, nach Freigabe vollständige Windows-Ab-/Anmeldung veranlassen, Sitzung/SMB-Verbindung erneuern und den ursprünglich gesperrten Zugriff erneut testen. **Nicht:** `gpupdate /force` als Ersatz für neue Benutzeranmeldung behandeln.

## 7. Entscheidung → gezielte Maßnahme

| Befund | Vorgehen |
|---|---|
| Port 445 nicht erreichbar | Netzwerk/Firewall/VPN/DNS/SMB-Server prüfen; bei Bedarf Infrastruktur eskalieren. |
| Share- oder NTFS-Recht fehlt | Berechtigung gemäß genehmigtem Rollenmodell gezielt zuweisen lassen. |
| Neue Gruppe noch nicht im Token | Neu anmelden und erneut testen; Sicherheitsrichtlinie beachten. |
| Explizites `Deny`/Vererbung unklar | L2/Sicherheitsverantwortliche einbeziehen, **nicht blind entfernen**. |
| Unterordner wird nicht angezeigt | ABE (berechtigungsabhängige Auflistung), NTFS-Regeln und Geltungsbereich prüfen. |
| Datei trotz passender ACL nicht lesbar | Eventuelle EFS-Verschlüsselung und zusätzliche Richtlinien untersuchen. |
| Nur Laufwerksbuchstabe fehlt, UNC funktioniert | GPO-Laufwerkszuordnung / Benutzerkontext prüfen, nicht pauschal Rechte erhöhen. |
| Lesen funktioniert, Schreiben nicht | Schreibrecht, Dateisperre und Anwendungs-/Dateizustand getrennt prüfen. |
| Problem seit Windows-Upgrade / Gastzugriff blockiert | SMB-Sicherheitsanforderungen prüfen, **Gastzugriff und SMB1 nicht pauschal aktivieren**. |

**Verbotene Schnelllösungen ohne Freigabe:** `Jeder: Vollzugriff`, rekursives `icacls /reset`, Besitzübernahme, Umgehung einer Deny-Regel, Abschalten von SMB-Schutzmechanismen.

## 8. Erfolgskontrolle und Ticketabschluss

- [ ] Mit dem **betroffenen Konto** und demselben UNC-Pfad testen.
- [ ] Genau die freigegebene Aktion (**Lesen** oder **Ändern**) funktioniert.
- [ ] Keine zusätzliche unzulässige Berechtigung erteilt.
- [ ] Ursache, Prüfungen, Änderungen, Genehmigung und Ergebnis dokumentieren.
- [ ] Falls ungeklärt: an L2 mit Befunden eskalieren.

**Kurzkommentar (fiktiv):** „Benutzerkonto vorhanden, SMB-Verbindung zu FS01 erfolgreich. Berechtigungen auf Share- und NTFS-Ebene kontrolliert. AD-Gruppenzugehörigkeit vorhanden, aber im laufenden Benutzer-Token noch nicht enthalten. Nach abgestimmter vollständiger Neuanmeldung Zugriff auf `\\FS01\Projekte\Einkauf` mit freigegebenem Leserecht erfolgreich. Keine ACL-Erweiterung vorgenommen.“

## 9. Quellen

- [Microsoft – Freigabe- und NTFS-Berechtigungen](https://learn.microsoft.com/de-de/iis/web-hosting/configuring-servers-in-the-windows-web-platform/configuring-share-and-ntfs-permissions)
- [Microsoft – SMB Zugriff verweigert](https://learn.microsoft.com/de-de/troubleshoot/windows-client/networking/access-denied-access-smb-file-share)
- [Microsoft – Get-SmbShareAccess](https://learn.microsoft.com/en-us/powershell/module/smbshare/get-smbshareaccess)
- [Microsoft – Get-Acl](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-acl?view=powershell-5.1)
- [Microsoft – whoami](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/whoami)

**Ausführliche Hintergründe, Grafiken und Lernfragen:** [`RB-005_Lernartikel.md`](RB-005_Lernartikel.md)

**Einsteiger-Ergänzung (Deny, Vererbung, ABE, GPO und zwei Schranken):** [`RB-005_Grundlagen_Freigabe-und-NTFS.md`](RB-005_Grundlagen_Freigabe-und-NTFS.md)
