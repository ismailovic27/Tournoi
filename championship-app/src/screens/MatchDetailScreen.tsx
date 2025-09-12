import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { apiService, Match } from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type MatchDetailScreenProps = StackScreenProps<RootStackParamList, 'MatchDetail'>;

const MatchDetailScreen: React.FC = () => {
  const route = useRoute<MatchDetailScreenProps['route']>();
  const navigation = useNavigation();
  const { matchId } = route.params;
  
  const [match, setMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    try {
      const matches = await apiService.getMatches();
      const foundMatch = matches.find(m => m.id === matchId);
      if (foundMatch) {
        setMatch(foundMatch);
        setHomeScore(foundMatch.homeScore?.toString() || '');
        setAwayScore(foundMatch.awayScore?.toString() || '');
      }
    } catch (error) {
      console.error('Error fetching match:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحميل بيانات المباراة');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!match) return;

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      Alert.alert('خطأ', 'يرجى إدخال نتيجة صحيحة');
      return;
    }

    if (homeScoreNum < 0 || awayScoreNum < 0) {
      Alert.alert('خطأ', 'النتيجة لا يمكن أن تكون سالبة');
      return;
    }

    setSaving(true);
    try {
      await apiService.updateMatch(match.id, {
        homeScore: homeScoreNum,
        awayScore: awayScoreNum,
        status: 'COMPLETED'
      });
      
      Alert.alert('نجح', 'تم حفظ النتيجة بنجاح', [
        {
          text: 'موافق',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error('Error saving match result:', error);
      Alert.alert('خطأ', 'حدث خطأ في حفظ النتيجة');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsLive = async () => {
    if (!match) return;

    try {
      await apiService.updateMatch(match.id, {
        status: 'LIVE'
      });
      fetchMatch(); // Refresh match data
      Alert.alert('نجح', 'تم تحديث حالة المباراة إلى مباشر');
    } catch (error) {
      console.error('Error updating match status:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحديث حالة المباراة');
    }
  };

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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>لم يتم العثور على المباراة</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.matchInfo}>
          <Text style={styles.groupName}>{match.group?.name || 'مباراة ودية'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
            <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamSection}>
            <Text style={styles.teamName}>{match.homeTeam.name}</Text>
            <Text style={styles.teamLabel}>الفريق المضيف</Text>
          </View>
          
          <View style={styles.vsSection}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <View style={styles.teamSection}>
            <Text style={styles.teamName}>{match.awayTeam.name}</Text>
            <Text style={styles.teamLabel}>الفريق الضيف</Text>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>النتيجة</Text>
          
          <View style={styles.scoreInputsContainer}>
            <View style={styles.scoreInputSection}>
              <Text style={styles.scoreLabel}>{match.homeTeam.name}</Text>
              <TextInput
                style={styles.scoreInput}
                value={homeScore}
                onChangeText={setHomeScore}
                placeholder="0"
                keyboardType="numeric"
                textAlign="center"
                editable={match.status !== 'COMPLETED'}
              />
            </View>
            
            <View style={styles.scoreDivider}>
              <Text style={styles.scoreDividerText}>-</Text>
            </View>
            
            <View style={styles.scoreInputSection}>
              <Text style={styles.scoreLabel}>{match.awayTeam.name}</Text>
              <TextInput
                style={styles.scoreInput}
                value={awayScore}
                onChangeText={setAwayScore}
                placeholder="0"
                keyboardType="numeric"
                textAlign="center"
                editable={match.status !== 'COMPLETED'}
              />
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {match.status === 'SCHEDULED' && (
            <TouchableOpacity 
              style={[styles.button, styles.liveButton]} 
              onPress={handleMarkAsLive}
            >
              <Text style={styles.buttonText}>بدء المباراة</Text>
            </TouchableOpacity>
          )}
          
          {match.status !== 'COMPLETED' && (
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSaveResult}
              disabled={saving}
            >
              <Text style={styles.buttonText}>
                {saving ? 'جاري الحفظ...' : 'حفظ النتيجة'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {match.playedAt && (
          <View style={styles.matchDetails}>
            <Text style={styles.detailText}>
              تاريخ اللعب: {new Date(match.playedAt).toLocaleDateString('ar-SA')}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContainer: {
    padding: 16,
  },
  matchInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  teamSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
  },
  teamLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  vsSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  scoreSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  scoreInputSection: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    width: 80,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  scoreDivider: {
    marginHorizontal: 20,
  },
  scoreDividerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  liveButton: {
    backgroundColor: '#ef4444',
  },
  saveButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchDetails: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    textAlign: 'center',
  },
});

export default MatchDetailScreen;