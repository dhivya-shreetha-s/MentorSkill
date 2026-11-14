export const logAgentStart = async (userId, agentName, workflow, inputSummary, supabase) => {
  if (!supabase || userId === 'demo-user-1') return `log-${Date.now()}`;
  try {
    const { data, error } = await supabase
      .from('agent_logs')
      .insert({ user_id: userId, agent_name: agentName, workflow, status: 'running', input_summary: inputSummary })
      .select().single();
    return data?.id;
  } catch (e) {
    return `log-${Date.now()}`;
  }
};

export const logAgentComplete = async (logId, outputSummary, executionTimeMs, supabase) => {
  if (!supabase || !logId || logId.startsWith('log-')) return;
  try {
    await supabase.from('agent_logs').update({
      status: 'completed',
      output_summary: outputSummary,
      execution_time_ms: executionTimeMs,
      updated_at: new Date().toISOString()
    }).eq('id', logId);
  } catch (e) {}
};

export const logAgentFail = async (logId, errorMessage, supabase) => {
  if (!supabase || !logId || logId.startsWith('log-')) return;
  try {
    await supabase.from('agent_logs').update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString()
    }).eq('id', logId);
  } catch (e) {}
};
