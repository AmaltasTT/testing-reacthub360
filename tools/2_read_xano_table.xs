// Reads paginated rows from whitelisted Xano tables for MCP inspection.
tool read_xano_table {
  instructions = "Use this read-only tool to inspect Xano table data while reasoning about backend logic. Call list_xano_tables first when unsure which table to inspect. Keep page_size small unless the user explicitly needs a larger sample. Sensitive tables require include_sensitive=true because they may contain credentials, tokens, sessions, personal data, or raw external payloads."

  input {
    text table_name filters=trim
    int page?=1
    int page_size?=25
    bool include_sensitive?
  }

  stack {
    var $safe_page {
      value = $input.page
    }
  
    conditional {
      if ($safe_page == null || $safe_page <= 0) {
        var.update $safe_page {
          value = 1
        }
      }
    }
  
    var $safe_size {
      value = $input.page_size
    }
  
    conditional {
      if ($safe_size == null || $safe_size <= 0) {
        var.update $safe_size {
          value = 25
        }
      }
    
      elseif ($safe_size > 100) {
        var.update $safe_size {
          value = 100
        }
      }
    }
  
    var $rows {
      value = []
    }
  
    var $tool_error {
      value = null
    }
  
    conditional {
      if (($input.table_name == "00_platform_data_raw" || $input.table_name == "Users" || $input.table_name == "auth_provider" || $input.table_name == "invitations" || $input.table_name == "linked_accounts" || $input.table_name == "organizations" || $input.table_name == "raw_testing_data" || $input.table_name == "session") && $input.include_sensitive != true) {
        var.update $tool_error {
          value = "This table may contain sensitive data. Re-run with include_sensitive=true only when the user explicitly needs this table."
        }
      }
    
      elseif ($input.table_name == "00_platform_data_raw") {
        db.query "00_platform_data_raw" {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "Users") {
        db.query Users {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "act_metrics") {
        db.query act_metrics {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "auth_provider") {
        db.query auth_provider {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "campaign_auth_providers") {
        db.query campaign_auth_providers {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "campaign_context") {
        db.query campaign_context {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "campaigns") {
        db.query campaigns {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "convert_metrics") {
        db.query convert_metrics {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "engage_metrics") {
        db.query engage_metrics {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "goal") {
        db.query goal {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "harmonized_metrics_mapping") {
        db.query harmonized_metrics_mapping {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "invitations") {
        db.query invitations {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "linked_accounts") {
        db.query linked_accounts {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "logs") {
        db.query logs {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "metric_normalization_cache") {
        db.query metric_normalization_cache {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "metrics_category") {
        db.query metrics_category {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "organization_proxy_roas_config") {
        db.query organization_proxy_roas_config {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "organization_targets") {
        db.query organization_targets {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "organizations") {
        db.query organizations {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "plan") {
        db.query plan {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "platform_intent_multipliers") {
        db.query platform_intent_multipliers {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "platforms") {
        db.query platforms {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "raw_testing_data") {
        db.query raw_testing_data {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "reach_metrics") {
        db.query reach_metrics {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "session") {
        db.query session {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      elseif ($input.table_name == "subscription") {
        db.query subscription {
          return = {
            type  : "list"
            paging: {page: $safe_page, per_page: $safe_size, totals: true}
          }
        } as $r
      
        var.update $rows {
          value = $r
        }
      }
    
      else {
        var.update $tool_error {
          value = "Unknown table. Call list_xano_tables for supported table names."
        }
      }
    }
  }

  response = {
    table_name       : $input.table_name
    page             : $safe_page
    page_size        : $safe_size
    include_sensitive: $input.include_sensitive
    error            : $tool_error
    rows             : $rows
  }

  tags = ["mcp", "database", "read-only"]
  history = 10
}