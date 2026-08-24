import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const PWA_URL = 'https://appfontigola.github.io/asociacion-juvenil-pwa/';

type Mode = 'entry' | 'exit';

const QRScreen: React.FC = () => {
  const { goBack } = useNav();
  const [mode, setMode] = useState<Mode>('entry');
  const url = PWA_URL + (mode === 'entry' ? '?checkin' : '?checkout');

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.title}>QR {mode === 'entry' ? 'entrada' : 'salida'}</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'entry' && styles.toggleActive]}
          onPress={() => setMode('entry')}
        >
          <Text style={[styles.toggleText, mode === 'entry' && styles.toggleTextActive]}>
            Entrada
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'exit' && styles.toggleActive]}
          onPress={() => setMode('exit')}
        >
          <Text style={[styles.toggleText, mode === 'exit' && styles.toggleTextActive]}>
            Salida
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {mode === 'entry'
          ? 'Escanea para marcar entrada en el local'
          : 'Escanea para marcar salida del local'}
      </Text>

      <Card style={styles.qrCard}>
        <Image
          source={{ uri: qrImageUrl }}
          style={styles.qrImage}
          resizeMode="contain"
        />
      </Card>

      <Text style={styles.hint}>
        {mode === 'entry'
          ? 'Imprime el QR y pégalo en la entrada del local'
          : 'Imprime el QR y pégalo en la salida del local'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  backBtn: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    padding: spacing.xs,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  qrCard: {
    alignItems: 'center',
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  qrImage: {
    width: 300,
    height: 300,
  },
  placeholder: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontStyle: 'italic',
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textMuted,
  },
  toggleTextActive: {
    fontWeight: '600',
    color: '#fff',
  },
});

export default QRScreen;
