import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_W } = Dimensions.get('window');
const PICK_CARD_W = Math.min(SCREEN_W * 0.72, 280);
const PREVIEW_W = Math.min(SCREEN_W * 0.44, 168);

const C = {
  navy: '#071A2F',
  card: '#102B46',
  inner: '#0C2238',
  neon: '#5CC8FF',
  neonBright: '#00D4FF',
  green: '#00FF99',
  red: '#FF4455',
  yellow: '#F59E0B',
  white: '#FFFFFF',
  subtle: '#B9D6EA',
  muted: '#8BA4BC',
  border: 'rgba(92, 200, 255, 0.2)',
};

const user = {
  name: 'Eddie',
  initials: 'EG',
};

const SMART_PICKS = [
  { id: '1', sport: 'NBA', matchup: 'Celtics @ Knicks', pick: 'Celtics -3.5', conf: 87, edge: '+4.2%', risk: 'LOW' },
  { id: '2', sport: 'NBA', matchup: 'Lakers @ Suns', pick: 'Over 228.5', conf: 72, edge: '+2.8%', risk: 'MED' },
  { id: '3', sport: 'NFL', matchup: 'Chiefs vs Bills', pick: 'Bills ML', conf: 61, edge: '+1.1%', risk: 'HIGH' },
];

const INJURY_ROWS = [
  { id: '1', player: 'J. Brunson', status: 'Questionable', impact: 'HIGH' },
  { id: '2', player: 'K. Porzingis', status: 'Probable', impact: 'LOW' },
];

const RISK_COLOR: Record<string, string> = {
  LOW: C.green,
  MED: C.neon,
  HIGH: C.red,
  HIGH_IMPACT: C.red,
  LOW_IMPACT: C.green,
};

function Bar({ pct, color = C.green }: { pct: number; color?: string }) {
  return (
    <View style={s.barTrack}>
      <View style={[s.barFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

function QuantumEngineCard({
  sport,
  setSport,
  scan,
}: {
  sport: 'All' | 'NFL' | 'NBA' | 'EPL';
  setSport: (t: 'All' | 'NFL' | 'NBA' | 'EPL') => void;
  scan: number;
}) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.32],
  });

  const iconScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const scanGlow = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={s.quantumWrap}>
      <Animated.View style={[s.quantumGlow, { opacity: glowOpacity }]} />
      <Animated.View style={[s.card, s.quantum]}>
        <View style={s.rowBetween}>
          <View style={s.quantumLeft}>
            <Animated.Text style={[s.quantumIcon, { transform: [{ scale: iconScale }] }]}>
              ⚡
            </Animated.Text>
            <View>
              <Text style={s.cardTitle}>Quantum AI Engine</Text>
              <Text style={s.mono}>// scanning markets…</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pills}>
          {(['All', 'NFL', 'NBA', 'EPL'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.pill, sport === t && s.pillOn]}
              onPress={() => setSport(t)}
              activeOpacity={0.85}
            >
              <Text style={[s.pillTxt, sport === t && s.pillTxtOn]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.empty}>
          <Text style={s.emptyTitle}>No games detected · standing by</Text>
        </View>

        <View style={s.scanRow}>
          <Text style={s.scanLbl}>Market scan</Text>
          <Animated.Text style={[s.scanPct, { opacity: scanGlow }]}>{scan}%</Animated.Text>
        </View>
        <Bar pct={scan} color={C.neonBright} />
        <Text style={s.scanFoot}>847 lines · NBA · NFL · NHL · Props</Text>
      </Animated.View>
    </View>
  );
}

export default function HomeScreen() {
  const [sport, setSport] = useState<'All' | 'NFL' | 'NBA' | 'EPL'>('All');
  const scan = 73;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <View style={s.headerTopLine}>
              <View style={s.logo}>
                <Text style={s.logoMark}>{user.initials}</Text>
              </View>
              <View style={s.greetingCol}>
                <Text style={s.welcomeLbl}>Welcome back</Text>
                <Text style={s.userName} numberOfLines={1}>
                  {user.name}
                </Text>
              </View>
            </View>
            <Text style={s.dashboardTitle}>ODDSLAB AI Dashboard</Text>
          </View>
          <View style={s.liveBadge}>
            <View style={s.liveDot} />
            <Text style={s.liveTxt}>LIVE</Text>
          </View>
        </View>
      </View>

      <QuantumEngineCard sport={sport} setSport={setSport} scan={scan} />

      {/* Smart Picks */}
      <View style={s.secHead}>
        <Text style={s.secTitle}>Smart Picks</Text>
        <Text style={s.secLink}>View all</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.picksScroll}>
        {SMART_PICKS.map((p) => (
          <TouchableOpacity key={p.id} style={[s.pickCard, { width: PICK_CARD_W }]} activeOpacity={0.9}>
            <View style={s.rowBetween}>
              <Text style={s.pickSport}>{p.sport}</Text>
              <View style={[s.risk, { borderColor: RISK_COLOR[p.risk] }]}>
                <Text style={[s.riskTxt, { color: RISK_COLOR[p.risk] }]}>{p.risk}</Text>
              </View>
            </View>
            <Text style={s.pickMatch}>{p.matchup}</Text>
            <Text style={s.pickLine}>{p.pick}</Text>
            <View style={s.pickMeta}>
              <View>
                <Text style={s.metaLbl}>CONF</Text>
                <Text style={[s.metaVal, { color: p.conf >= 75 ? C.green : p.conf >= 65 ? C.neon : C.red }]}>
                  {p.conf}%
                </Text>
              </View>
              <View style={s.metaDiv} />
              <View>
                <Text style={s.metaLbl}>EDGE</Text>
                <Text style={[s.metaVal, { color: C.green }]}>{p.edge}</Text>
              </View>
            </View>
            <Bar pct={p.conf} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Intel previews — horizontal */}
      <Text style={[s.secTitle, s.intelHead]}>Game Intelligence</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.picksScroll}>
        {/* Injury */}
        <View style={[s.preview, { width: PREVIEW_W }]}>
          <Text style={s.previewIco}>📋</Text>
          <Text style={s.previewTitle}>Injury Report</Text>
          <Text style={s.previewSub}>Line impact analysis</Text>
          {INJURY_ROWS.map((r) => (
            <View key={r.id} style={s.previewRow}>
              <Text style={s.previewName} numberOfLines={1}>{r.player}</Text>
              <Text style={[s.previewTag, { color: RISK_COLOR[`${r.impact}_IMPACT`] ?? C.red }]}>
                {r.status}
              </Text>
            </View>
          ))}
          <Text style={s.previewLink}>+3 more →</Text>
        </View>

        {/* Weather */}
        <View style={[s.preview, { width: PREVIEW_W }]}>
          <Text style={s.previewIco}>🌧</Text>
          <Text style={s.previewTitle}>Weather Impact</Text>
          <Text style={s.previewSub}>Live conditions</Text>
          <Text style={s.previewGame}>Chiefs @ Bills</Text>
          <Text style={s.previewDetail}>Snow · 18°F</Text>
          <View style={s.warn}>
            <Text style={s.warnTxt}>HIGH IMPACT</Text>
          </View>
          <Text style={[s.previewDetail, { color: C.red }]}>-1.5 pts O/U</Text>
        </View>

        {/* Matchup */}
        <View style={[s.preview, { width: PREVIEW_W }]}>
          <Text style={s.previewIco}>⚔</Text>
          <Text style={s.previewTitle}>Matchup History</Text>
          <Text style={s.previewSub}>H2H & AI trend</Text>
          <Text style={s.previewGame}>Celtics vs Knicks</Text>
          <Text style={[s.previewDetail, { color: C.green }]}>4-1 ATS · 7/10 cover</Text>
          <Text style={s.previewDetail}>Under 6 of last 8</Text>
        </View>
      </ScrollView>

      <View style={s.pad} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.navy },
  scroll: { paddingHorizontal: 14, paddingBottom: 20 },

  header: {
    marginHorizontal: -14,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLeft: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    marginRight: 12,
  },
  headerTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.card,
    borderWidth: 2,
    borderColor: C.neon,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoMark: {
    color: C.neon,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  greetingCol: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  welcomeLbl: {
    color: C.muted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  userName: {
    color: C.white,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  dashboardTitle: {
    color: C.neon,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,255,153,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,153,0.35)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
    marginRight: 5,
  },
  liveTxt: {
    color: C.green,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  card: {
    backgroundColor: C.card, borderRadius: 12, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: C.border,
  },
  quantumWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  quantumGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    backgroundColor: C.neonBright,
  },
  quantum: {
    borderColor: 'rgba(0,212,255,0.35)',
    marginBottom: 0,
    overflow: 'hidden',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  quantumLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  quantumIcon: { fontSize: 16 },
  cardTitle: { color: C.white, fontSize: 14, fontWeight: '800' },
  mono: { color: C.neon, fontSize: 10, fontFamily: 'monospace', marginTop: 1 },
  pills: { gap: 6, marginTop: 10, marginBottom: 8 },
  pill: {
    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 14,
    backgroundColor: C.inner, borderWidth: 1, borderColor: C.border, marginRight: 6,
  },
  pillOn: { backgroundColor: C.neonBright, borderColor: C.neonBright },
  pillTxt: { color: C.subtle, fontSize: 11, fontWeight: '600' },
  pillTxtOn: { color: C.navy, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: 8 },
  emptyTitle: { color: C.muted, fontSize: 11, fontWeight: '600' },
  scanRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginBottom: 4 },
  scanLbl: { color: C.subtle, fontSize: 11, fontWeight: '600' },
  scanPct: { color: C.neonBright, fontSize: 11, fontWeight: '800' },
  scanFoot: { color: C.muted, fontSize: 10, marginTop: 4 },

  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 2 },
  secTitle: { color: C.white, fontSize: 15, fontWeight: '800' },
  secLink: { color: C.neon, fontSize: 12, fontWeight: '600' },
  intelHead: { marginTop: 4, marginBottom: 8 },
  picksScroll: { paddingRight: 6, marginBottom: 10 },

  pickCard: {
    backgroundColor: C.card, borderRadius: 12, padding: 12, marginRight: 10,
    borderWidth: 1, borderColor: C.border,
  },
  pickSport: { color: C.neon, fontSize: 10, fontWeight: '800' },
  risk: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  riskTxt: { fontSize: 8, fontWeight: '800' },
  pickMatch: { color: C.muted, fontSize: 11, marginTop: 6 },
  pickLine: { color: C.white, fontSize: 16, fontWeight: '800', marginTop: 2, marginBottom: 8 },
  pickMeta: { flexDirection: 'row', marginBottom: 6 },
  metaLbl: { color: C.muted, fontSize: 8, fontWeight: '700', marginBottom: 1 },
  metaVal: { fontSize: 13, fontWeight: '800' },
  metaDiv: { width: 1, backgroundColor: C.border, marginHorizontal: 10 },

  preview: {
    backgroundColor: C.card, borderRadius: 12, padding: 10, marginRight: 10,
    borderWidth: 1, borderColor: C.border, minHeight: 148,
  },
  previewIco: { fontSize: 14, marginBottom: 4 },
  previewTitle: { color: C.white, fontSize: 13, fontWeight: '800' },
  previewSub: { color: C.neon, fontSize: 10, marginTop: 1, marginBottom: 6 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  previewName: { color: C.subtle, fontSize: 11, fontWeight: '600', flex: 1 },
  previewTag: { fontSize: 9, fontWeight: '700' },
  previewGame: { color: C.white, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  previewDetail: { color: C.muted, fontSize: 10, marginBottom: 2 },
  previewLink: { color: C.neon, fontSize: 10, fontWeight: '600', marginTop: 4 },
  warn: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(255,68,85,0.15)', paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 4, marginVertical: 2, borderWidth: 1, borderColor: 'rgba(255,68,85,0.35)',
  },
  warnTxt: { color: C.red, fontSize: 8, fontWeight: '800' },

  barTrack: { height: 4, backgroundColor: C.inner, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  pad: { height: 8 },
});
