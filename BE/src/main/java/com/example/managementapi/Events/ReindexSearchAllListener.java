package com.example.managementapi.Events;

import com.example.managementapi.Service.ElasticSearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Slf4j
@Component
public class ReindexSearchAllListener {
    private final ElasticSearchService elasticSearchService;

    @Async
    @EventListener(ReindexEvent.ReindexSearchAllEvent.class)
    public void handleReindex() {
        elasticSearchService.reindexAll();

    }
}
