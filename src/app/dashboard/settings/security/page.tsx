/**
 * @file page.tsx
 * @description Security settings page with 2FA and password management
 * @author 1
 * @created 2026-01-06
 * @updated 2026-01-06
 * @updates 1
 * @lines 300
 * @size 10.5 KB
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Smartphone, Key, Copy, CheckCircle2 } from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { success, error: showError } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    qrCode: string;
    secret: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      // In a real app, you'd fetch this from an API
      // For now, we'll check from session or user profile
      const response = await fetch("/api/auth/2fa/status");
      if (response.ok) {
        const data = await response.json();
        setTwoFactorEnabled(data.enabled || false);
      }
    } catch (error) {
      console.error("Error loading 2FA status:", error);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la configuration");
      }

      const data = await response.json();
      setTwoFactorSetup(data);
      setShowBackupCodes(true);
      success("Configuration 2FA initialisée. Scannez le QR code et vérifiez avec un code.");
    } catch (error: any) {
      showError("Erreur", error.message || "Erreur lors de la configuration 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showError("Erreur", "Le code de vérification doit contenir 6 chiffres");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: verificationCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Code invalide");
      }

      const data = await response.json();
      if (data.success) {
        setTwoFactorEnabled(true);
        setTwoFactorSetup(null);
        setVerificationCode("");
        setShowBackupCodes(false);
        success("Authentification à deux facteurs activée avec succès");
      }
    } catch (error: any) {
      showError("Erreur", error.message || "Code de vérification invalide");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/disable", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la désactivation");
      }

      setTwoFactorEnabled(false);
      success("Authentification à deux facteurs désactivée");
    } catch (error: any) {
      showError("Erreur", error.message || "Erreur lors de la désactivation 2FA");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, codeId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(codeId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Paramètres de sécurité
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
          Gérez votre authentification à deux facteurs et vos mots de passe
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Authentification à deux facteurs (2FA)
            </CardTitle>
            <CardDescription>
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {twoFactorEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      2FA activée
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Votre compte est protégé par l'authentification à deux facteurs
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="w-full"
                >
                  Désactiver 2FA
                </Button>
              </div>
            ) : twoFactorSetup ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">1. Scannez ce QR code avec votre application d'authentification (Google Authenticator, Authy, etc.)</p>
                  <div className="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg border">
                    {twoFactorSetup.qrCode && (
                      <img
                        src={twoFactorSetup.qrCode}
                        alt="QR Code 2FA"
                        className="w-48 h-48"
                      />
                    )}
                  </div>
                  <p className="mt-4 mb-2">2. Entrez le code de vérification à 6 chiffres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Code de vérification</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest"
                  />
                </div>

                <Button
                  onClick={handleVerify2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full"
                >
                  {loading ? "Vérification..." : "Vérifier et activer"}
                </Button>

                {showBackupCodes && twoFactorSetup.backupCodes && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      ⚠️ Codes de secours - Sauvegardez-les maintenant
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                      Ces codes peuvent être utilisés pour accéder à votre compte si vous perdez votre appareil.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {twoFactorSetup.backupCodes.map((code, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                        >
                          <code className="text-xs font-mono">{code}</code>
                          <button
                            onClick={() => copyToClipboard(code, `backup-${index}`)}
                            className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            {copiedCode === `backup-${index}` ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire en demandant un code unique en plus de votre mot de passe.
                </p>
                <Button
                  onClick={handleSetup2FA}
                  disabled={loading}
                  className="w-full"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {loading ? "Configuration..." : "Configurer 2FA"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Changer le mot de passe
            </CardTitle>
            <CardDescription>
              Mettez à jour votre mot de passe régulièrement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/settings/password")}
              className="w-full"
            >
              <Key className="w-4 h-4 mr-2" />
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
