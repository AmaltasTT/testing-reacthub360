// Lists the Xano tables that the xano-meta MCP server can inspect.
tool list_xano_tables {
  instructions = "Use this read-only discovery tool before reading Xano table data. It returns the table names supported by read_xano_table and flags tables that may contain credentials, tokens, sessions, raw platform payloads, or other sensitive data."

  input {
  }

  stack {
    var $tables {
      value = [
        {name: "00_platform_data_raw", sensitive: true, note: "Raw imported platform payloads"}
        {name: "Users", sensitive: true, note: "User profile and authentication-related data"}
        {name: "act_metrics", sensitive: false, note: "Action-stage metric rows"}
        {name: "auth_provider", sensitive: true, note: "OAuth provider records with access and refresh tokens"}
        {name: "campaign_auth_providers", sensitive: false, note: "Campaign to auth provider links"}
        {name: "campaign_context", sensitive: false, note: "Campaign context data"}
        {name: "campaigns", sensitive: false, note: "Campaign records"}
        {name: "convert_metrics", sensitive: false, note: "Conversion-stage metric rows"}
        {name: "engage_metrics", sensitive: false, note: "Engagement-stage metric rows"}
        {name: "goal", sensitive: false, note: "Organization goal configuration"}
        {name: "harmonized_metrics_mapping", sensitive: false, note: "Metric mapping configuration"}
        {name: "invitations", sensitive: true, note: "Invitation records and tokens"}
        {name: "linked_accounts", sensitive: true, note: "Connected external account identifiers and metadata"}
        {name: "logs", sensitive: false, note: "Application logs"}
        {name: "metric_normalization_cache", sensitive: false, note: "Cached metric normalization bounds"}
        {name: "metrics_category", sensitive: false, note: "Metric category definitions"}
        {name: "organization_proxy_roas_config", sensitive: false, note: "Proxy ROAS configuration"}
        {name: "organization_targets", sensitive: false, note: "Organization benchmark targets"}
        {name: "organizations", sensitive: true, note: "Organization profile data and magic-link fields"}
        {name: "plan", sensitive: false, note: "Subscription plan records"}
        {name: "platform_intent_multipliers", sensitive: false, note: "Platform intent multiplier configuration"}
        {name: "platforms", sensitive: false, note: "Platform catalog"}
        {name: "raw_testing_data", sensitive: true, note: "Raw test workbook or imported demo data"}
        {name: "reach_metrics", sensitive: false, note: "Reach-stage metric rows"}
        {name: "session", sensitive: true, note: "Session records"}
        {name: "subscription", sensitive: false, note: "Subscription records"}
      ]
    }
  }

  response = {count: $tables|count, tables: $tables}
  tags = ["mcp", "database", "read-only", "metadata"]
  history = 10
}