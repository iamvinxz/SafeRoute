import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnnouncementCard = ({ title, content, author, createdAt }) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <View style={styles.card}>
      {/* Header: icon + title */}
      <View style={styles.header}>
        <Ionicons name="megaphone-outline" size={16} color="#378ADD" />
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* Content */}
      {content ? (
        <Text style={styles.content} numberOfLines={3}>
          {content}
        </Text>
      ) : (
        "No content for this announcement"
      )}

      {/* Footer: author + date */}
      <View style={styles.footer}>
        <Text style={styles.author}>{author ?? "—"}</Text>
        {formattedDate ? (
          <Text style={styles.date}>{formattedDate}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    height: 115,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderLeftWidth: 3,
    borderLeftColor: "#378ADD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
    color: "#1a1a1a",
    lineHeight: 20,
  },
  content: {
    fontSize: 12,
    fontFamily: "Montserrat",
    color: "#6b6b6b",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  author: {
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#6b6b6b",
  },
  date: {
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#6b6b6b",
  },
});

export default AnnouncementCard;
