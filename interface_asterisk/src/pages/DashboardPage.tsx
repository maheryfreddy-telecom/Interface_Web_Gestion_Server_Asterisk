import { useEffect, useState } from 'react';
import api from '../services/api';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Couleurs pour le graphique camembert
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalExtensions: 0,
    onlineDevices: 0,
    totalCalls: 0,
    totalDuration: 0,
    answeredCalls: 0,
    missedCalls: 0,
  });
  const [dispositionData, setDispositionData] = useState<any[]>([]);
  const [callsByHour, setCallsByHour] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [resEndpoints, resContacts, resCdr] = await Promise.all([
        api.get('/ps-endpoints'),
        api.get('/ps-contacts'),
        api.get('/cdr?limit=1000')
      ]);

      const cdrs = resCdr.data.data || [];
      const totalDuration = cdrs.reduce((acc: number, curr: any) => acc + (curr.billsec || 0), 0);
      
      // Répartition par disposition
      const dispositionCounts: any = {};
      cdrs.forEach((c: any) => {
        const status = c.disposition || 'UNKNOWN';
        dispositionCounts[status] = (dispositionCounts[status] || 0) + 1;
      });
      
      const chartData = Object.keys(dispositionCounts).map(key => ({
        name: key,
        value: dispositionCounts[key]
      }));

      // Appels par heure (dernières 24h)
      const hourCounts: any = {};
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000).getHours();
        hourCounts[hour] = 0;
      }
      
      cdrs.forEach((c: any) => {
        if (c.start) {
          const callDate = new Date(c.start);
          const hoursDiff = Math.floor((now.getTime() - callDate.getTime()) / (1000 * 60 * 60));
          if (hoursDiff < 24) {
            const hour = callDate.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
          }
        }
      });

      const hourData = Object.keys(hourCounts).map(hour => ({
        hour: `${hour}h`,
        appels: hourCounts[hour]
      }));

      const answeredCount = cdrs.filter((c: any) => c.disposition === 'ANSWERED').length;
      const missedCount = cdrs.filter((c: any) => c.disposition !== 'ANSWERED').length;

      setStats({
        totalExtensions: resEndpoints.data.length,
        onlineDevices: resContacts.data.length,
        totalCalls: cdrs.length,
        totalDuration: Math.round(totalDuration / 60),
        answeredCalls: answeredCount,
        missedCalls: missedCount,
      });
      setDispositionData(chartData);
      setCallsByHour(hourData);

    } catch (err) {
      console.error("Erreur dashboard", err);
    }
  };

  const StatCard = ({ title, value, subtitle, color, bgColor }: any) => (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
      color: 'white',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0px 12px 24px ${color}40`,
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 1, fontSize: '0.95rem', fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const successRate = stats.totalCalls > 0 
    ? Math.round((stats.answeredCalls / stats.totalCalls) * 100) 
    : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DashboardIcon fontSize="large" /> Tableau de Bord
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mise à jour : {new Date().toLocaleString('fr-FR')}
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard 
            title="Extensions Totales" 
            value={stats.totalExtensions}
            subtitle="Comptes SIP actifs"
            color="#1976d2"
            bgColor="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard 
            title="Appareils en Ligne" 
            value={stats.onlineDevices}
            subtitle="Connectés maintenant"
            color="#2e7d32"
            bgColor="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard 
            title="Total Appels" 
            value={stats.totalCalls}
            subtitle={`${stats.answeredCalls} répondus`}
            color="#ed6c02"
            bgColor="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <StatCard 
            title="Taux de Réussite" 
            value={`${successRate}%`}
            subtitle={`${stats.totalDuration} min totales`}
            color="#9c27b0"
            bgColor="#ba68c8"
          />
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3} mb={4}>
        
        {/* Répartition des appels */}
        <Grid item xs={12} md={6} sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" mb={2} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon /> Répartition des Appels
            </Typography>
            {dispositionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={dispositionData}
                    cx="50%" cy="45%"
                    outerRadius={110}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => {
                      const total = dispositionData.reduce((sum, item) => sum + item.value, 0);
                      const percent = ((entry.value / total) * 100).toFixed(1);
                      return `${percent}%`;
                    }}
                    labelLine={true}
                  >
                    {dispositionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => {
                      const total = dispositionData.reduce((sum, item) => sum + item.value, 0);
                      const percent = ((value / total) * 100).toFixed(1);
                      return [`${value} appels (${percent}%)`];
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="85%">
                <Typography color="text.secondary">Aucune donnée disponible</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Activité par heure */}
        <Grid item xs={12} md={6} sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" mb={2} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon /> Activité des Dernières 24h
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart 
                data={callsByHour}
                margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hour" 
                  label={{ value: 'Heure', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Nombre d\'appels', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} appels`, 'Nombre']}
                  labelFormatter={(label) => `${label}h`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #ccc',
                    borderRadius: 8,
                    padding: 10
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="appels" 
                  stroke="#1976d2" 
                  strokeWidth={3}
                  name="Nombre d'appels"
                  dot={{ fill: '#1976d2', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Statistiques détaillées */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={3} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon /> Statistiques Détaillées
        </Typography>
        <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {stats.answeredCalls}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Appels Répondus
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                  <Typography variant="h4" color="error" fontWeight={700}>
                    {stats.missedCalls}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Appels Manqués
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f3e5f5', borderRadius: 2 }}>
                  <Typography variant="h4" color="secondary" fontWeight={700}>
                    {stats.totalDuration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Minutes Totales
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    {stats.totalCalls > 0 ? Math.round(stats.totalDuration / stats.totalCalls) : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Durée Moyenne (min)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
      </Paper>
    </Box>
  );
}