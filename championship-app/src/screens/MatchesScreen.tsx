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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { apiService, Match } from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '#22c55e';
      case 'LIVE': return '#ef4444';
      case 'SCHEDULED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'انتهت';
      case 'LIVE': return 'مباشر';
      case 'SCHEDULED': return 'مجدولة';
      case 'POSTPONED': return 'مؤجلة';
      case 'CANCELLED': return 'ملغية';
      default: return status;
    }
  };

  return (
    <TouchableOpacity style={styles.matchCard} onPress={onPress}>
      <View style={styles.matchHeader}>
        <Text style={styles.groupName}>{match.group?.name || 'مباراة ودية'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
          <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
        </View>
      </View>
      
      <View style={styles.matchContent}>
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{match.homeTeam.name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {match.homeScore !== null ? match.homeScore : '-'}
            </Text>
          </View>
        </View>
        
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        
        <View style={styles.teamContainer}>
          <Text style={styles.teamName}>{match.awayTeam.name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {match.awayScore !== null ? match.awayScore : '-'}
            </Text>
          </View>
        </View>
      </View>
      
      {match.matchday && (
        <Text style={styles.matchday}>الجولة {match.matchday}</Text>
      )}
    </TouchableOpacity>
  );
};

const MatchesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = async () => {
    try {
      const fetchedMatches = await apiService.getMatches();
      setMatches(fetchedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحميل المباريات');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const handleMatchPress = (match: Match) => {
    navigation.navigate('MatchDetail', { matchId: match.id });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!matches.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>لا توجد مباريات متاحة</Text>
        <Text style={styles.emptySubtext}>يرجى إجراء القرعة أولاً</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard 
            match={item} 
            onPress={() => handleMatchPress(item)}
          />
        )}
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
  listContainer: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 40,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
  },
  vsContainer: {
    marginHorizontal: 16,
  },
  vsText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  matchday: {
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

export default MatchesScreen;