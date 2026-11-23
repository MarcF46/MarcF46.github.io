# RB-041 – AD-Gruppenmitgliedschaft greift nicht (L2)

**Projekt:** 50 Tickets – 50 typische IT-Supportfälle · **Stand:** 22.11.2026 · **Version:** 1.0  
**Status:** Offizielle Microsoft-Quellen recherchiert; fachlich strukturiert, **nicht praktisch validiert**. Alle Fallbeispiele sind ausdrücklich fiktiv.

## Paketinhalt (sechs Dateien)

| Datei | Funktion |
|---|---|
| `RB-041_Lernartikel.md` | Ausführlicher Lernartikel (15 Kapitel) mit Quellen, Diagnosevergleich, Beispielen, Active Recall |
| `RB-041_Praxis-Runbook.md` | L2-Runbook (10 Arbeitsabschnitte) mit Sicherheitsgate, lesenden Prüfungen, Retest und Musterkommentar |
| `assets/rb041_henne_ei_ad_gruppenmitgliedschaft.png` | Professionelle Henne-und-Ei-Infografik mit AD-/Token-/Rechtekette |
| `assets/rb041_diagnosebaum.svg` | Technischer Diagnose-Entscheidungsbaum als Vektorgrafik |
| `assets/rb041_diagnosebaum_preview.png` | PNG-Vorschau für Website und Lernnotizen |
| `README.md` | Diese Übersicht, Quellenhinweise und Validierungsstatus |

## Zentrale Lernziele

1. **AD-Mitgliedschaft → verschachtelte Sicherheitsgruppen → Logon-Token/Kerberos → Ziel-ACL** unterscheiden.
2. Gruppen **direkt, rekursiv und autorisierungsbezogen** prüfen, ohne die Resultate zu verwechseln.
3. `whoami /groups`, `klist`, `Get-ADGroupMember`, `Get-ADAccountAuthorizationGroup`, `Get-SmbShareAccess` und `Get-Acl` korrekt einordnen.
4. In SMB-Szenarien **Freigabe- und NTFS-Rechte sowie die benötigte konkrete Operation** prüfen.
5. Eine sichere Neuanmeldung planen, ohne `klist purge`, ACLs oder Mitgliedschaften auf Verdacht zu verändern.
6. Die **Anwendung des Rechts** am ursprünglichen Konto nachweisen und mit einem Negativtest Least Privilege prüfen.

## Praxisvalidierung (noch offen)

Zum Testen in einem **isolierten und autorisierten AD-Lab**: 1 Domänencontroller, ein Windows-Client, ein SMB-Testshare und zwei Testbenutzer; verschachtelte Gruppen anlegen, erfolgreiche und verweigerte Operation dokumentieren, dann neue Gruppenmitgliedschaft bei bestehender Sitzung vergeben und `whoami`/AD/Server-ACL vergleichen. Nur genehmigte Teständerungen vornehmen. Cross-Domain-/Replikationsfälle erfordern zusätzliche Domänencontroller; alternativ anfangs fiktive Diagnoseausgaben nutzen.

**Wichtig:** `klist purge` und An-/Abmeldung sind **nicht** rein lesende Tests. Sitzung, offene Dateien, VPN und Rollback beachten. Keine Berechtigungseskalation zu „Domain Admins“ und keine pauschalen ACL-Einstellungen.

## Offizielle Herstellerquellen

- Active Directory-Sicherheitsgruppen: https://learn.microsoft.com/de-de/windows-server/identity/ad-ds/manage/understand-security-groups
- Änderungen von Mitgliedschaften / VPN / Kerberos: https://learn.microsoft.com/de-de/troubleshoot/windows-client/group-policy/group-membership-changes-not-updating-over-some-vpn-connections
- whoami: https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/whoami
- Get-ADGroupMember: https://learn.microsoft.com/de-de/powershell/module/activedirectory/get-adgroupmember?view=windowsserver2025-ps
- Get-ADAccountAuthorizationGroup: https://learn.microsoft.com/en-us/powershell/module/activedirectory/get-adaccountauthorizationgroup?view=windowsserver2025-ps
- klist: https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/klist
- Get-SmbShareAccess: https://learn.microsoft.com/de-de/powershell/module/smbshare/get-smbshareaccess
- Remote Effective Permissions: https://learn.microsoft.com/en-us/troubleshoot/windows-server/windows-security/access-checks-windows-apis-return-incorrect-results
- Replikation: https://learn.microsoft.com/de-de/troubleshoot/windows-server/active-directory/diagnose-replication-failures

## Spätere Website-Integration

Für `marcf46.github.io`: Nur nach gesondertem Auftrag veröffentlichen und die vorhandene Website-Struktur beibehalten. Die Bildverweise in den beiden Markdown-Dateien sind relativ zum Paket-Ordner. Die KI-Visualisierung kann mit folgender Kennzeichnung veröffentlicht werden: **„Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.“**

**Transparenz:** Theoretisch recherchierte Fehleranalyse ≠ im produktiven Unternehmen oder Lab erfolgreich nachgestellte Lösung. Das Runbook ist eine Lern- und Diagnosevorlage, keine Freigabe zur produktiven Änderung.
