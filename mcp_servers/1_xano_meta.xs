mcp_server "xano-meta" {
  canonical = "FD4OjcqH"
  instructions = "This MCP server exposes read-only tools for inspecting the ReactIQ Xano workspace. Use list_xano_tables before reading data, keep table samples small, and only request sensitive tables when the user explicitly needs those rows for debugging."
  tags = ["database", "read-only", "metadata"]
  tools = [{name: "list_xano_tables"}, {name: "read_xano_table"}]
  history = 0
}