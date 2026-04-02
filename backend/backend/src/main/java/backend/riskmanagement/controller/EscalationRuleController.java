package backend.riskmanagement.controller;



import backend.riskmanagement.entity.EscalationRule;
import backend.riskmanagement.service.EscalationRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escalation-rules")
@RequiredArgsConstructor
public class EscalationRuleController {

    private final EscalationRuleService escalationRuleService;

    @PostMapping
    public EscalationRule createRule(@RequestBody EscalationRule rule) {
        return escalationRuleService.createRule(rule);
    }

    @GetMapping
    public List<EscalationRule> getAllRules() {
        return escalationRuleService.getAllRules();
    }
}