import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { apiService, Tournament, Group } from '../services/api';

interface GroupCardProps {
  group: Group;
  onPress: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onPress }) => {
  return (
    <TouchableOpacity style={styles.groupCard} onPress={onPress}>
      <Text style={styles.groupTitle}>{group.name}</Text>
      <View style={styles.teamsContainer}>
        {group.teams.map((team, index) => (
          <View key={team.id} style={styles.teamChip}>
            <Text style={styles.teamText}>{team.name}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.matchesCount}>
        {group.matches?.length || 0} مباراة
      </Text>
    </TouchableOpacity>
  );
};

const GroupsScreen: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournament = async () => {
    try {
      const tournaments = await apiService.getTournaments();
      if (tournaments.length > 0) {
        // Get the most recent tournament
        const latestTournament = tournaments[tournaments.length - 1];
        const fullTournament = await apiService.getTournament(latestTournament.id);
        setTournament(fullTournament);
      }
    } catch (error) {
      console.error('Error fetching tournament:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTournament();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTournament();
  };

  const handleGroupPress = (group: Group) => {
    Alert.alert(
      group.name,
      `الفرق: ${group.teams.map(team => team.name).join(', ')}`,
      [{ text: 'موافق', style: 'default' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!tournament || !tournament.groups.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>لا توجد مجموعات متاحة</Text>
        <Text style={styles.emptySubtext}>يرجى إجراء القرعة أولاً</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tournamentTitle}>{tournament.name}</Text>
      <FlatList
        data={tournament.groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard 
            group={item} 
            onPress={() => handleGroupPress(item)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  tournamentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e40af',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  groupCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 150,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 12,
  },
  teamsContainer: {
    flex: 1,
  },
  teamChip: {
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  teamText: {
    fontSize: 12,
    color: '#0284c7',
    textAlign: 'center',
    fontWeight: '500',
  },
  matchesCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default GroupsScreen;