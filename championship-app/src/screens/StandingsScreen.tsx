import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import { apiService, Tournament, GroupStanding } from '../services/api';

interface StandingTableProps {
  groupName: string;
  standings: GroupStanding[];
}

const StandingTable: React.FC<StandingTableProps> = ({ groupName, standings }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.groupTitle}>{groupName}</Text>
      
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.positionCell]}>#</Text>
        <Text style={[styles.headerCell, styles.teamCell]}>الفريق</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>ل</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>ف</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>ت</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>خ</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>له</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>عليه</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>الفرق</Text>
        <Text style={[styles.headerCell, styles.pointsCell]}>النقاط</Text>
      </View>
      
      {standings.map((standing, index) => (
        <View key={standing.teamId} style={[
          styles.tableRow,
          index < 2 ? styles.qualifiedRow : styles.normalRow
        ]}>
          <Text style={[styles.cell, styles.positionCell, styles.positionText]}>
            {index + 1}
          </Text>
          <Text style={[styles.cell, styles.teamCell, styles.teamText]} numberOfLines={1}>
            {standing.team}
          </Text>
          <Text style={[styles.cell, styles.numberCell]}>{standing.played}</Text>
          <Text style={[styles.cell, styles.numberCell]}>{standing.won}</Text>
          <Text style={[styles.cell, styles.numberCell]}>{standing.drawn}</Text>
          <Text style={[styles.cell, styles.numberCell]}>{standing.lost}</Text>
          <Text style={[styles.cell, styles.numberCell]}>{standing.goalsFor}</Text>
          <Text style={[styles.cell, styles.numberCell]}>{standing.goalsAgainst}</Text>
          <Text style={[styles.cell, styles.numberCell, 
            standing.goalDifference > 0 ? styles.positiveGD : 
            standing.goalDifference < 0 ? styles.negativeGD : styles.neutralGD
          ]}>
            {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
          </Text>
          <Text style={[styles.cell, styles.pointsCell, styles.pointsText]}>
            {standing.points}
          </Text>
        </View>
      ))}
    </View>
  );
};

const StandingsScreen: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [groupStandings, setGroupStandings] = useState<{[key: string]: GroupStanding[]}>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStandings = async () => {
    try {
      const tournaments = await apiService.getTournaments();
      if (tournaments.length > 0) {
        const latestTournament = tournaments[tournaments.length - 1];
        const fullTournament = await apiService.getTournament(latestTournament.id);
        setTournament(fullTournament);
        
        // Fetch standings for each group
        const standings: {[key: string]: GroupStanding[]} = {};
        for (const group of fullTournament.groups) {
          try {
            const groupData = await apiService.getGroupStandings(group.id);
            standings[group.id] = groupData.standings;
          } catch (error) {
            console.error(`Error fetching standings for group ${group.name}:`, error);
            standings[group.id] = [];
          }
        }
        setGroupStandings(standings);
      }
    } catch (error) {
      console.error('Error fetching standings:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحميل الترتيب');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStandings();
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
        <Text style={styles.emptyText}>لا توجد بيانات ترتيب متاحة</Text>
        <Text style={styles.emptySubtext}>يرجى إجراء القرعة أولاً</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.tournamentTitle}>{tournament.name}</Text>
      <Text style={styles.subtitle}>ترتيب المجموعات</Text>
      
      {tournament.groups.map((group) => (
        <StandingTable
          key={group.id}
          groupName={group.name}
          standings={groupStandings[group.id] || []}
        />
      ))}
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>مفتاح الألوان:</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#dcfce7' }]} />
          <Text style={styles.legendText}>المراكز المؤهلة للدور التالي</Text>
        </View>
      </View>
    </ScrollView>
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
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#374151',
    paddingVertical: 12,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  qualifiedRow: {
    backgroundColor: '#dcfce7',
  },
  normalRow: {
    backgroundColor: '#ffffff',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
  },
  cell: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  positionCell: {
    width: 30,
  },
  teamCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  numberCell: {
    width: 25,
  },
  pointsCell: {
    width: 35,
  },
  positionText: {
    fontWeight: 'bold',
    color: '#1e40af',
  },
  teamText: {
    fontWeight: '500',
    textAlign: 'right',
  },
  pointsText: {
    fontWeight: 'bold',
    color: '#059669',
  },
  positiveGD: {
    color: '#059669',
  },
  negativeGD: {
    color: '#dc2626',
  },
  neutralGD: {
    color: '#6b7280',
  },
  legend: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendColor: {
    width: 20,
    height: 16,
    borderRadius: 4,
    marginLeft: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#6b7280',
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

export default StandingsScreen;