import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import path from "path";

const fontsDir = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(fontsDir, "Inter-Regular.ttf"),     fontWeight: "normal" },
    { src: path.join(fontsDir, "Inter-Bold.ttf"),        fontWeight: "bold" },
    { src: path.join(fontsDir, "Inter-Italic.ttf"),      fontStyle: "italic" },
    { src: path.join(fontsDir, "Inter-BoldItalic.ttf"),  fontWeight: "bold", fontStyle: "italic" },
  ],
});

const NAVY       = "#1a2d5a";
const NAVY_DARK  = "#112044";
const NAVY_MID   = "#243d77";
const GOLD       = "#c9a84c";
const GOLD_LIGHT = "#e4c46e";
const WHITE      = "#ffffff";
const WHITE_60   = "rgba(255,255,255,0.6)";
const WHITE_30   = "rgba(255,255,255,0.3)";

const S = StyleSheet.create({
  page: {
    backgroundColor: NAVY_DARK,
    fontFamily: "Inter",
    padding: 0,
    position: "relative",
  },

  // ─── Zlatý dvojitý rámeček ────────────────────────────────────────
  outerBorder: {
    position: "absolute",
    top: 18, left: 18, right: 18, bottom: 18,
    borderWidth: 1,
    borderColor: GOLD,
  },
  innerBorder: {
    position: "absolute",
    top: 24, left: 24, right: 24, bottom: 24,
    borderWidth: 0.5,
    borderColor: GOLD_LIGHT,
  },

  // ─── Rohové ozdoby (větší) ────────────────────────────────────────
  cTL: { position: "absolute", top: 10,    left: 10,  width: 28, height: 28, borderTopWidth: 3, borderLeftWidth: 3,   borderColor: GOLD },
  cTR: { position: "absolute", top: 10,    right: 10, width: 28, height: 28, borderTopWidth: 3, borderRightWidth: 3,  borderColor: GOLD },
  cBL: { position: "absolute", bottom: 10, left: 10,  width: 28, height: 28, borderBottomWidth: 3, borderLeftWidth: 3,  borderColor: GOLD },
  cBR: { position: "absolute", bottom: 10, right: 10, width: 28, height: 28, borderBottomWidth: 3, borderRightWidth: 3, borderColor: GOLD },

  // ─── Dekorativní zlatý pruh nahoře ───────────────────────────────
  topStripe: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 8,
    backgroundColor: GOLD,
  },
  bottomStripe: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: 8,
    backgroundColor: GOLD,
  },

  // ─── Jemný půlkruhový header ─────────────────────────────────────
  headerBg: {
    position: "absolute",
    top: 8, left: 0, right: 0,
    height: 130,
    backgroundColor: NAVY_MID,
  },

  // ─── Celkový layout ──────────────────────────────────────────────
  layout: {
    position: "absolute",
    top: 8, left: 30, right: 30, bottom: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 22,
  },

  // ─── Horní blok ──────────────────────────────────────────────────
  topBlock: {
    alignItems: "center",
    width: "100%",
  },

  academyName: {
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 6,
    color: GOLD,
    marginBottom: 6,
  },

  // dekorativní linka pod názvem akademie
  goldLine: {
    width: 300,
    height: 1,
    backgroundColor: GOLD,
    marginBottom: 10,
    opacity: 0.6,
  },

  certTitle: {
    fontWeight: "bold",
    fontSize: 40,
    color: WHITE,
    letterSpacing: 3,
    marginBottom: 4,
  },

  awardedTo: {
    fontSize: 12,
    color: WHITE_60,
    letterSpacing: 2,
  },

  // ─── Střed – jméno příjemce ───────────────────────────────────────
  midBlock: {
    alignItems: "center",
    width: "100%",
  },

  // Ozdobná linka před jménem
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 340,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.5,
  },
  ornamentDiamond: {
    width: 7,
    height: 7,
    backgroundColor: GOLD,
    marginHorizontal: 8,
    transform: "rotate(45deg)",
  },

  name: {
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 56,
    color: GOLD_LIGHT,
    textAlign: "center",
    marginBottom: 10,
  },

  ornamentRowBottom: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    width: 340,
  },

  completionText: {
    fontSize: 12,
    color: WHITE_60,
    textAlign: "center",
    marginBottom: 7,
    letterSpacing: 0.5,
  },

  courseName: {
    fontWeight: "bold",
    fontSize: 22,
    color: WHITE,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // ─── Pečeť ───────────────────────────────────────────────────────
  seal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: NAVY_DARK,
    marginTop: 12,
  },
  sealInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  sealText: {
    fontWeight: "bold",
    fontSize: 7,
    color: GOLD,
    letterSpacing: 0.8,
    textAlign: "center",
    lineHeight: 1.5,
  },

  // ─── Spodní podpisy ───────────────────────────────────────────────
  bottomBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },

  sigBlock: {
    flexDirection: "column",
    alignItems: "center",
    width: "44%",
  },
  sigLine: {
    width: "100%",
    height: 1,
    backgroundColor: WHITE_30,
    marginBottom: 7,
  },
  sigName: {
    fontWeight: "bold",
    fontSize: 12,
    color: WHITE,
    textAlign: "center",
    marginBottom: 2,
  },
  sigLabel: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 1.5,
    textAlign: "center",
  },
});

interface Props {
  recipientName: string;
  courseName: string;
  issuerName: string;
  date: string;
}

export default function CertificatePDF({ recipientName, courseName, issuerName, date }: Props) {
  return (
    <Document
      title={`Certifikát – ${recipientName} – ${courseName}`}
      author="Akademie Drsov"
    >
      <Page size="A4" orientation="landscape" style={S.page}>

        {/* Pozadí horního bloku */}
        <View style={S.headerBg} />

        {/* Zlaté pruhy nahoře/dole */}
        <View style={S.topStripe} />
        <View style={S.bottomStripe} />

        {/* Rámeček dvojitý */}
        <View style={S.outerBorder} />
        <View style={S.innerBorder} />

        {/* Rohové ozdoby */}
        <View style={S.cTL} />
        <View style={S.cTR} />
        <View style={S.cBL} />
        <View style={S.cBR} />

        {/* Hlavní obsah */}
        <View style={S.layout}>

          {/* Horní blok */}
          <View style={S.topBlock}>
            <Text style={S.academyName}>A K A D E M I E   D R S O V</Text>
            <View style={S.goldLine} />
            <Text style={S.certTitle}>ONLINE CERTIFIKÁT</Text>
            <Text style={S.awardedTo}>udělený pro</Text>
          </View>

          {/* Střed – jméno */}
          <View style={S.midBlock}>
            <View style={S.ornamentRow}>
              <View style={S.ornamentLine} />
              <View style={S.ornamentDiamond} />
              <View style={S.ornamentLine} />
            </View>

            <Text style={S.name}>{recipientName}</Text>

            <View style={S.ornamentRowBottom}>
              <View style={S.ornamentLine} />
              <View style={S.ornamentDiamond} />
              <View style={S.ornamentLine} />
            </View>

            <Text style={S.completionText}>za úspěšné dokončení online video kurzu</Text>
            <Text style={S.courseName}>{courseName}</Text>

            <View style={S.seal}>
              <View style={S.sealInner}>
                <Text style={S.sealText}>{"AKADEMIE\nDRSOV"}</Text>
              </View>
            </View>
          </View>

          {/* Podpisy */}
          <View style={S.bottomBlock}>
            <View style={S.sigBlock}>
              <View style={S.sigLine} />
              <Text style={S.sigName}>{issuerName}</Text>
              <Text style={S.sigLabel}>VYSTAVIL</Text>
            </View>
            <View style={S.sigBlock}>
              <View style={S.sigLine} />
              <Text style={S.sigName}>{date}</Text>
              <Text style={S.sigLabel}>DATUM VYDÁNÍ</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
